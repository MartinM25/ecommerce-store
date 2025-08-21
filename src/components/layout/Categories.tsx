"use client"

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const categories = [
  "All",
  "Women",
  "Men",
  "Kids",
  "Home",
  "Jewellery",
  "Technology",
  "Sale"
]

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    // Navigation Logic
    console.log("selected category:", category)
  }

  return (
    <div className="w-full overflow-hidden">
      <NavigationMenu className="w-full max-w-none">
        <div className="overflow-x-auto scrollbar-hide">
          <NavigationMenuList className="flex gap-1 min-w-max px-4 py-2">
            {categories.map((category) => (
              <NavigationMenuItem key={category}>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer whitespace-nowrap",
                    selectedCategory === category
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </div>
      </NavigationMenu>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}