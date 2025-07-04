import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpTooltipProps {
  content: string;
  illustration?: "lightbulb" | "star" | "heart" | "info";
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  children?: React.ReactNode;
}

const illustrations = {
  lightbulb: "💡",
  star: "⭐",
  heart: "💚",
  info: "ℹ️"
};

export function HelpTooltip({ 
  content, 
  illustration = "info", 
  side = "top",
  className,
  children 
}: HelpTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children || (
            <button 
              className={cn(
                "inline-flex items-center justify-center w-5 h-5 rounded-full",
                "hover:bg-gray-100 transition-colors duration-200 ml-2",
                "focus:outline-none focus:ring-2 focus:ring-primary-custom focus:ring-opacity-50",
                className
              )}
              type="button"
            >
              <HelpCircle className="w-4 h-4 text-gray-500 hover:text-primary-custom" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="max-w-xs p-4 bg-white border border-gray-200 shadow-lg rounded-lg"
        >
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0 mt-0.5">
              {illustrations[illustration]}
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Specialized tooltip variants for common use cases
export function InfoTooltip({ content, ...props }: Omit<HelpTooltipProps, "illustration">) {
  return <HelpTooltip content={content} illustration="info" {...props} />;
}

export function TipTooltip({ content, ...props }: Omit<HelpTooltipProps, "illustration">) {
  return <HelpTooltip content={content} illustration="lightbulb" {...props} />;
}

export function FeatureTooltip({ content, ...props }: Omit<HelpTooltipProps, "illustration">) {
  return <HelpTooltip content={content} illustration="star" {...props} />;
}

export function EncouragementTooltip({ content, ...props }: Omit<HelpTooltipProps, "illustration">) {
  return <HelpTooltip content={content} illustration="heart" {...props} />;
}