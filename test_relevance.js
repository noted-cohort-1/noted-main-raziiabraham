const args = {
  url: "https://api-f1db6c.stack.tryrelevance.com/latest/agents/a15caa91-6e61-4821-b277-b27d19ca8775/tasks/821a4b84-516d-431d-a2b3-cc38baa14886/view",
  headers: {
    "Authorization": "f1db6c:0de57bdbe135439dafcf1e17df2feceb",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ page_size: 20 })
};

fetch(args.url, { method: "POST", headers: args.headers, body: args.body })
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
