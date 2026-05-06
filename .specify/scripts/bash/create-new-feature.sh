#!/usr/bin/env bash

set -e

JSON_MODE=false
SHORT_NAME=""
TICKET_ID=""
BRANCH_TYPE="feature"
EXPLORE_MODE=false
ARGS=()
i=1
while [ $i -le $# ]; do
    arg="${!i}"
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --explore)
            EXPLORE_MODE=true
            ;;
        --short-name)
            if [ $((i + 1)) -gt $# ]; then echo 'Error: --short-name requires a value' >&2; exit 1; fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then echo 'Error: --short-name requires a value' >&2; exit 1; fi
            SHORT_NAME="$next_arg"
            ;;
        --ticket-id)
            if [ $((i + 1)) -gt $# ]; then echo 'Error: --ticket-id requires a value' >&2; exit 1; fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then echo 'Error: --ticket-id requires a value' >&2; exit 1; fi
            TICKET_ID="$next_arg"
            ;;
        --branch-type)
            if [ $((i + 1)) -gt $# ]; then echo 'Error: --branch-type requires a value' >&2; exit 1; fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then echo 'Error: --branch-type requires a value' >&2; exit 1; fi
            BRANCH_TYPE="$next_arg"
            ;;
        --help|-h)
            echo "Usage: $0 [--json] [--explore | --ticket-id <NOT-XXXX>] [--branch-type <feature|hotfix|bugfix>] [--short-name <name>] <feature_description>"
            echo ""
            echo "Options:"
            echo "  --json                    Output in JSON format"
            echo "  --explore                 Create an explore spec (no Linear ticket required)"
            echo "  --ticket-id <NOT-XXXX>    Linear ticket ID (required unless --explore)"
            echo "  --branch-type <type>      Branch type: feature, hotfix, or bugfix (default: feature)"
            echo "  --short-name <name>       Custom short name (2-4 words) for the branch"
            echo "  --help, -h                Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --ticket-id NOT-1234 --short-name 'document-presence' 'Add presence indicators to documents'"
            echo "  $0 --json --ticket-id NOT-5678 --branch-type bugfix --short-name 'fix-archive' 'Fix recursive archive on shared docs'"
            echo "  $0 --json --explore --short-name 'comments-mvp' 'Explore inline comments on documents'"
            exit 0
            ;;
        *)
            ARGS+=("$arg")
            ;;
    esac
    i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]}"
if [ -z "$FEATURE_DESCRIPTION" ]; then
    echo "Usage: $0 [--json] [--explore | --ticket-id <NOT-XXXX>] [--branch-type <type>] [--short-name <name>] <feature_description>" >&2
    exit 1
fi

if $EXPLORE_MODE; then
    BRANCH_TYPE="explore"
else
    if [ -z "$TICKET_ID" ]; then
        echo "Error: --ticket-id is required (or use --explore for explore mode). Format: NOT-XXXX (e.g., NOT-1234)" >&2
        exit 1
    fi

    TICKET_ID=$(echo "$TICKET_ID" | tr '[:lower:]' '[:upper:]')

    if [[ ! "$TICKET_ID" =~ ^NOT-[0-9]+$ ]]; then
        echo "Error: Invalid ticket ID format '$TICKET_ID'. Expected: NOT-XXXX (e.g., NOT-1234)" >&2
        exit 1
    fi

    case "$BRANCH_TYPE" in
        feature|hotfix|bugfix) ;;
        *)
            echo "Error: Invalid branch type '$BRANCH_TYPE'. Must be: feature, hotfix, or bugfix" >&2
            exit 1
            ;;
    esac
fi

find_repo_root() {
    local dir="$1"
    while [ "$dir" != "/" ]; do
        if [ -d "$dir/.git" ] || [ -d "$dir/.specify" ]; then
            echo "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

clean_branch_name() {
    local name="$1"
    echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//'
}

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if git rev-parse --show-toplevel >/dev/null 2>&1; then
    REPO_ROOT=$(git rev-parse --show-toplevel)
    HAS_GIT=true
else
    REPO_ROOT="$(find_repo_root "$SCRIPT_DIR")"
    if [ -z "$REPO_ROOT" ]; then
        echo "Error: Could not determine repository root. Please run this script from within the repository." >&2
        exit 1
    fi
    HAS_GIT=false
fi

cd "$REPO_ROOT"

SPECS_DIR="$REPO_ROOT/specs"
mkdir -p "$SPECS_DIR"

generate_branch_name() {
    local description="$1"
    local stop_words="^(i|a|an|the|to|for|of|in|on|at|by|with|from|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|may|might|must|shall|this|that|these|those|my|your|our|their|want|need|add|get|set)$"
    local clean_name=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/ /g')
    local meaningful_words=()
    for word in $clean_name; do
        [ -z "$word" ] && continue
        if ! echo "$word" | grep -qiE "$stop_words"; then
            if [ ${#word} -ge 3 ]; then
                meaningful_words+=("$word")
            elif echo "$description" | grep -q "\b${word^^}\b"; then
                meaningful_words+=("$word")
            fi
        fi
    done

    if [ ${#meaningful_words[@]} -gt 0 ]; then
        local max_words=3
        if [ ${#meaningful_words[@]} -eq 4 ]; then max_words=4; fi
        local result=""
        local count=0
        for word in "${meaningful_words[@]}"; do
            if [ $count -ge $max_words ]; then break; fi
            if [ -n "$result" ]; then result="$result-"; fi
            result="$result$word"
            count=$((count + 1))
        done
        echo "$result"
    else
        local cleaned=$(clean_branch_name "$description")
        echo "$cleaned" | tr '-' '\n' | grep -v '^$' | head -3 | tr '\n' '-' | sed 's/-$//'
    fi
}

if [ -n "$SHORT_NAME" ]; then
    BRANCH_SUFFIX=$(clean_branch_name "$SHORT_NAME")
else
    BRANCH_SUFFIX=$(generate_branch_name "$FEATURE_DESCRIPTION")
fi

if $EXPLORE_MODE; then
    MAX_EXP=0
    if [ -d "$SPECS_DIR" ]; then
        for dir in "$SPECS_DIR"/EXP-*; do
            if [ -d "$dir" ]; then
                dirname=$(basename "$dir")
                num=$(echo "$dirname" | grep -oE '^EXP-([0-9]+)' | sed 's/EXP-//')
                if [ -n "$num" ] && [ "$num" -gt "$MAX_EXP" ]; then
                    MAX_EXP=$num
                fi
            fi
        done
    fi
    NEXT_EXP=$((MAX_EXP + 1))
    EXPLORE_ID="EXP-${NEXT_EXP}"

    if [ -n "$BRANCH_SUFFIX" ]; then
        SPEC_DIR_NAME="${EXPLORE_ID}-${BRANCH_SUFFIX}"
    else
        SPEC_DIR_NAME="${EXPLORE_ID}"
    fi

    BRANCH_NAME="explore/${SPEC_DIR_NAME}"
else
    if [ -n "$BRANCH_SUFFIX" ]; then
        SPEC_DIR_NAME="${TICKET_ID}-${BRANCH_SUFFIX}"
    else
        SPEC_DIR_NAME="${TICKET_ID}"
    fi

    BRANCH_NAME="${BRANCH_TYPE}/${SPEC_DIR_NAME}"

    MAX_BRANCH_LENGTH=244
    if [ ${#BRANCH_NAME} -gt $MAX_BRANCH_LENGTH ]; then
        TYPE_PREFIX_LEN=$((${#BRANCH_TYPE} + 1))
        TICKET_PREFIX_LEN=$((${#TICKET_ID} + 1))
        MAX_SUFFIX_LENGTH=$((MAX_BRANCH_LENGTH - TYPE_PREFIX_LEN - TICKET_PREFIX_LEN))

        TRUNCATED_SUFFIX=$(echo "$BRANCH_SUFFIX" | cut -c1-$MAX_SUFFIX_LENGTH)
        TRUNCATED_SUFFIX=$(echo "$TRUNCATED_SUFFIX" | sed 's/-$//')

        ORIGINAL_BRANCH_NAME="$BRANCH_NAME"
        if [ -n "$TRUNCATED_SUFFIX" ]; then
            SPEC_DIR_NAME="${TICKET_ID}-${TRUNCATED_SUFFIX}"
        else
            SPEC_DIR_NAME="${TICKET_ID}"
        fi
        BRANCH_NAME="${BRANCH_TYPE}/${SPEC_DIR_NAME}"

        >&2 echo "[specify] Warning: Branch name exceeded GitHub's 244-byte limit"
        >&2 echo "[specify] Original: $ORIGINAL_BRANCH_NAME (${#ORIGINAL_BRANCH_NAME} bytes)"
        >&2 echo "[specify] Truncated to: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
    fi
fi

if [ "$HAS_GIT" = true ]; then
    git fetch --all --prune 2>/dev/null || true

    if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" 2>/dev/null; then
        >&2 echo "[specify] Branch '$BRANCH_NAME' already exists locally. Checking out."
        git checkout "$BRANCH_NAME"
    elif $EXPLORE_MODE; then
        git checkout -b "$BRANCH_NAME"
    elif git show-ref --verify --quiet "refs/remotes/origin/$BRANCH_NAME" 2>/dev/null; then
        >&2 echo "[specify] Branch '$BRANCH_NAME' exists on remote. Checking out."
        git checkout -b "$BRANCH_NAME" "origin/$BRANCH_NAME"
    else
        git checkout -b "$BRANCH_NAME"
    fi
else
    >&2 echo "[specify] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME"
fi

FEATURE_DIR="$SPECS_DIR/$SPEC_DIR_NAME"
mkdir -p "$FEATURE_DIR"

TEMPLATE="$REPO_ROOT/.specify/templates/spec-template.md"
SPEC_FILE="$FEATURE_DIR/spec.md"
if [ -f "$TEMPLATE" ]; then cp "$TEMPLATE" "$SPEC_FILE"; else touch "$SPEC_FILE"; fi

export SPECIFY_FEATURE="$BRANCH_NAME"

if $JSON_MODE; then
    if $EXPLORE_MODE; then
        printf '{"EXPLORE_ID":"%s","IS_EXPLORE":true,"TICKET_ID":"","BRANCH_TYPE":"explore","BRANCH_NAME":"%s","SPEC_DIR_NAME":"%s","SPEC_FILE":"%s"}\n' \
            "$EXPLORE_ID" "$BRANCH_NAME" "$SPEC_DIR_NAME" "$SPEC_FILE"
    else
        printf '{"EXPLORE_ID":"","IS_EXPLORE":false,"TICKET_ID":"%s","BRANCH_TYPE":"%s","BRANCH_NAME":"%s","SPEC_DIR_NAME":"%s","SPEC_FILE":"%s"}\n' \
            "$TICKET_ID" "$BRANCH_TYPE" "$BRANCH_NAME" "$SPEC_DIR_NAME" "$SPEC_FILE"
    fi
else
    if $EXPLORE_MODE; then
        echo "EXPLORE_ID: $EXPLORE_ID"
        echo "IS_EXPLORE: true"
    else
        echo "TICKET_ID: $TICKET_ID"
        echo "IS_EXPLORE: false"
    fi
    echo "BRANCH_TYPE: $BRANCH_TYPE"
    echo "BRANCH_NAME: $BRANCH_NAME"
    echo "SPEC_DIR_NAME: $SPEC_DIR_NAME"
    echo "SPEC_FILE: $SPEC_FILE"
    echo "SPECIFY_FEATURE environment variable set to: $BRANCH_NAME"
fi
