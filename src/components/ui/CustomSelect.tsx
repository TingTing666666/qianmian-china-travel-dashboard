/*
 * @Date: 2025-01-16 00:00:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-09-15 16:15:55
 * @FilePath: \qianmian-china-travel-dashboard\src\components\ui\CustomSelect.tsx
 */
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

export interface CustomSelectOption {
  value: string
  label: string
}

export interface CustomSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: CustomSelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
  ({ className, value, onValueChange, options, placeholder = "请选择", disabled = false }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedOption, setSelectedOption] = React.useState<CustomSelectOption | null>(
      options.find(option => option.value === value) || null
    )

    const handleSelect = (option: CustomSelectOption) => {
      setSelectedOption(option)
      onValueChange?.(option.value)
      setIsOpen(false)
    }

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen)
      }
    }

    // 点击外部关闭下拉菜单
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && 'current' in ref && ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, ref])

    // 更新选中项
    React.useEffect(() => {
      const option = options.find(option => option.value === value)
      setSelectedOption(option || null)
    }, [value, options])

    return (
      <div className={cn("relative", className)} ref={ref}>
        {/* 选择器按钮 */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            isOpen && "border-blue-500 ring-2 ring-blue-500/20"
          )}
        >
          <span className={cn(
            "truncate font-normal",
            !selectedOption && "text-gray-500"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {/* 下拉选项 */}
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
            <div className="max-h-60 overflow-auto py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-sm text-left transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    selectedOption?.value === option.value && "bg-blue-50 text-blue-600"
                  )}
                >
                  <span className="truncate font-normal">{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

CustomSelect.displayName = "CustomSelect"

export { CustomSelect }