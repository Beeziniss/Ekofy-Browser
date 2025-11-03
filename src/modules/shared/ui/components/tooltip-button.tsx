import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipButtonProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}

const TooltipButton = ({ children, content, side }: TooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        <p className="font-medium">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipButton;
