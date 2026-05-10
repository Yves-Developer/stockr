"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusIcon, Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import api from "@/lib/api"
import { toast } from "sonner"

interface Item {
  _id: string
  name: string
}

interface ComboAddProps {
  items: Item[]
  placeholder: string
  emptyMessage: string
  onSelect: (value: string) => void
  onCreate: (name: string) => Promise<Item | null>
  value?: string
  className?: string
}

export function ComboAdd({
  items,
  placeholder,
  emptyMessage,
  onSelect,
  onCreate,
  value,
  className,
}: ComboAddProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  const selectedItem = items.find((item) => item._id === value)

  const handleCreate = async () => {
    if (!search) return
    setIsCreating(true)
    try {
      const newItem = await onCreate(search)
      if (newItem) {
        onSelect(newItem._id)
        setOpen(false)
        setSearch("")
      }
    } catch (error) {
      console.error("Creation failed", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
        >
          {value ? selectedItem?.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={`Search ${placeholder.toLowerCase()}...`} 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty className="py-2 px-1">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground px-2">{emptyMessage}</p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="justify-start px-2 h-8 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={handleCreate}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2Icon className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <PlusIcon className="mr-2 h-3 w-3" />
                  )}
                  Create "{search}"
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item._id}
                  value={item.name}
                  onSelect={() => {
                    onSelect(item._id)
                    setOpen(false)
                  }}
                  data-checked={value === item._id}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {search && !items.some(i => i.name.toLowerCase() === search.toLowerCase()) && (
              <CommandGroup heading="Actions">
                <CommandItem
                  onSelect={handleCreate}
                  value={search}
                  className="text-primary font-medium"
                >
                  {isCreating ? (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusIcon className="mr-2 h-4 w-4" />
                  )}
                  Create "{search}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
