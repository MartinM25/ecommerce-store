"use client"

import { useState } from "react"
import { ArrowRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  {
    name: "Women",
    image: "/api/placeholder/400/500",
    description: "Elegant fashion for the modern woman"
  },
  {
    name: "Men", 
    image: "/api/placeholder/400/500",
    description: "Contemporary style for today's gentleman"
  },
  {
    name: "Kids",
    image: "/api/placeholder/400/300", 
    description: "Fun and comfortable clothing for children"
  },
  {
    name: "Home",
    image: "/api/placeholder/600/400",
    description: "Beautiful pieces to transform your space"
  },
  {
    name: "Jewellery",
    image: "/api/placeholder/400/300",
    description: "Exquisite pieces for every occasion"
  },
  {
    name: "Technology", 
    image: "/api/placeholder/400/300",
    description: "Latest gadgets and innovations"
  },
  {
    name: "Sale",
    image: "/api/placeholder/400/300",
    description: "Amazing deals you don't want to miss"
  }
]

export default function CategoryShowcase() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const handleCategoryClick = (categoryName: string) => {
    console.log("Navigate to category:", categoryName)
    // Add your navigation logic here
  }

  return (
    <div className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Women - Extra Large */}
          <div 
            className="md:col-span-2 lg:col-span-3 lg:row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: "#F5E6D3" }}
            onMouseEnter={() => setHoveredCategory("Women")}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick("Women")}
          >
            <div className="aspect-[4/5] md:aspect-[3/2] lg:aspect-[3/2] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-4xl lg:text-6xl font-bold mb-2">Women</h3>
                <p className="text-lg lg:text-xl opacity-90 mb-4">Elegant fashion for the modern woman</p>
                <div className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  hoveredCategory === "Women" ? "translate-x-2" : ""
                )}>
                  <span className="text-sm lg:text-base font-medium">Shop Now</span>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Men - Medium */}
          <div 
            className="md:col-span-1 lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: "#E8E2D4" }}
            onMouseEnter={() => setHoveredCategory("Men")}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick("Men")}
          >
            <div className="aspect-[4/5] lg:aspect-[2/3] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl lg:text-4xl font-bold mb-2">Men</h3>
                <p className="text-base lg:text-lg opacity-90 mb-4">Contemporary style for today"s gentleman</p>
                <div className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  hoveredCategory === "Men" ? "translate-x-2" : ""
                )}>
                  <span className="text-sm font-medium">Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Kids */}
          <div 
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: "#FFF8E7" }}
            onMouseEnter={() => setHoveredCategory("Kids")}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick("Kids")}
          >
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 text-gray-800">
                <h3 className="text-2xl font-bold mb-2">Kids</h3>
                <p className="text-sm opacity-80 mb-3">Fun & comfortable</p>
                <ChevronRight className={cn(
                  "w-5 h-5 transition-all duration-300",
                  hoveredCategory === "Kids" ? "translate-x-1" : ""
                )} />
              </div>
            </div>
          </div>

          {/* Home */}
          <div 
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: "#F0EDD4" }}
            onMouseEnter={() => setHoveredCategory("Home")}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick("Home")}
          >
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 text-gray-800">
                <h3 className="text-2xl font-bold mb-2">Home</h3>
                <p className="text-sm opacity-80 mb-3">Transform your space</p>
                <ChevronRight className={cn(
                  "w-5 h-5 transition-all duration-300",
                  hoveredCategory === "Home" ? "translate-x-1" : ""
                )} />
              </div>
            </div>
          </div>

          {/* Jewellery */}
          <div 
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: "#262535" }}
            onMouseEnter={() => setHoveredCategory("Jewellery")}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick("Jewellery")}
          >
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Jewellery</h3>
                <p className="text-sm opacity-90 mb-3">Exquisite pieces</p>
                <ChevronRight className={cn(
                  "w-5 h-5 transition-all duration-300",
                  hoveredCategory === "Jewellery" ? "translate-x-1" : ""
                )} />
              </div>
            </div>
          </div>

          {/* Technology */}
          <div 
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: "#000F30" }}
            onMouseEnter={() => setHoveredCategory("Technology")}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick("Technology")}
          >
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Technology</h3>
                <p className="text-sm opacity-90 mb-3">Latest innovations</p>
                <ChevronRight className={cn(
                  "w-5 h-5 transition-all duration-300",
                  hoveredCategory === "Technology" ? "translate-x-1" : ""
                )} />
              </div>
            </div>
          </div>

          {/* Sale */}
          <div 
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{ backgroundColor: "#764D2C" }}
            onMouseEnter={() => setHoveredCategory("Sale")}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => handleCategoryClick("Sale")}
          >
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Sale</h3>
                <p className="text-sm opacity-90 mb-3">Amazing deals</p>
                <ChevronRight className={cn(
                  "w-5 h-5 transition-all duration-300",
                  hoveredCategory === "Sale" ? "translate-x-1" : ""
                )} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}