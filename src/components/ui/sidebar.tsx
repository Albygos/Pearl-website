"use client"

import * as React from "react"
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarContextProps {
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [expanded, setExpanded] = React.useState(!isMobile)

  React.useEffect(() => {
    setExpanded(!isMobile)
  }, [isMobile])

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "left" | "right" }
>(({ className, side = "left", children, ...props }, ref) => {
  const { expanded } = useSidebar()
  return (
    <aside ref={ref} className={cn("h-screen fixed top-0 z-50", side === "left" ? "left-0" : "right-0", expanded ? "w-64" : "w-20" , "transition-all", className)} {...props}>
      <nav className="h-full flex flex-col bg-card border-r shadow-sm">
        {children}
      </nav>
    </aside>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { expanded, setExpanded } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn("p-4 pb-2 flex justify-between items-center", className)}
      {...props}
    >
      <div
        className={cn(
          "flex-1 transition-all",
          expanded ? "opacity-100" : "opacity-0"
        )}
      >
        {children}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExpanded((curr) => !curr)}
      >
        {expanded ? <ChevronFirst /> : <ChevronLast />}
      </Button>
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1 px-3", className)} {...props}>
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, children, ...props }, ref) => {
  return (
    <ul ref={ref} className={cn("flex-1", className)} {...props}>
      {children}
    </ul>
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => {
  return (
    <li ref={ref} className={cn("", className)} {...props}>
      {children}
    </li>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"


const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean, tooltip?: string }
>(({ className, children, asChild, tooltip, ...props }, ref) => {
  const { expanded } = useSidebar()

  const buttonContent = (
    <div
      className={cn(
        "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-secondary",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === 'span') {
            return null; // Don't render spans here
          }
          return React.cloneElement(child as React.ReactElement, {
            className: 'w-6 h-6',
          });
        }
        return child;
      })}
      <span
        className={cn(
          "overflow-hidden transition-all",
          expanded ? "w-52 ml-3" : "w-0"
        )}
      >
         {React.Children.map(children, (child) =>
          React.isValidElement(child) && child.type === 'span' ? child : null
        )}
      </span>
    </div>
  );
  
  const childEl = asChild ? <div {...props} ref={ref as any}>{buttonContent}</div> : <a {...props} ref={ref}>{buttonContent}</a>

  if (!expanded && tooltip) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {childEl}
          </TooltipTrigger>
          <TooltipContent side="right">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return childEl;
});
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { expanded } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn("border-t flex p-3", className)}
      {...props}
    >
      {children}
      <div
        className={cn(
          "flex justify-between items-center overflow-hidden transition-all",
          expanded ? "w-52 ml-3" : "w-0"
        )}
      >
        <div className="leading-4">
           {(children as any)?.props?.children?.find((child: any) => child.type === 'div')?.props?.children}
        </div>
        <MoreVertical size={20} />
      </div>
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { expanded } = useSidebar()
  const isMobile = useIsMobile()
  return (
    <main
      ref={ref}
      className={cn(
        "transition-all",
        !isMobile && (expanded ? "ml-64" : "ml-20"),
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
})
SidebarInset.displayName = "SidebarInset"


export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  useSidebar,
}
