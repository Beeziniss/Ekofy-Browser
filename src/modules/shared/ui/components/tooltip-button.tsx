import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipButtonProps {
  children: React.ReactNode;
  content: string;
}

const TooltipButton = ({ children, content }: TooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="font-bepro font-medium">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipButton;
