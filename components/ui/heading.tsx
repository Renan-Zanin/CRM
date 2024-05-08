interface HeadingProps {
  title: string;
  description: string;
}

export default function Heading({ title, description }: HeadingProps) {
  return (
    <div className="md:mt-10 mt-[-16px]">
      <h2 className="md:text-3xl text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
