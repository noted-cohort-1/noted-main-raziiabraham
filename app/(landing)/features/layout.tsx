export default function FeaturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col pt-8">
            <div className="flex-1">{children}</div>
        </div>
    );
}
