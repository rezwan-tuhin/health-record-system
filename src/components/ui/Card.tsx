import clsx from "clsx";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  glow?: "teal" | "blue" | "red" | "amber" | "none";
};

export default function Card({ as = "div", glow = "none", className, children, ...rest }: CardProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={clsx(
        "panel rounded-2xl",
        glow === "teal" && "glow-teal",
        glow === "blue" && "glow-blue",
        glow === "red" && "glow-red",
        glow === "amber" && "glow-amber",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}