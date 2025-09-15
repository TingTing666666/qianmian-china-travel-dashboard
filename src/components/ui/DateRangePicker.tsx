"use client"

import React, { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onDateRangeChange: (startDate: string, endDate: string) => void
  className?: string
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onDateRangeChange, 
  className = '' 
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempEndDate, setTempEndDate] = useState(endDate)

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempStartDate(startDate)
    setTempEndDate(endDate)
    setIsOpen(false)
  }

  const formatDateDisplay = (start: string, end: string) => {
    if (!start && !end) return '选择时间范围'
    if (!start) return `至 ${end}`
    if (!end) return `从 ${start}`
    return `${start} 至 ${end}`
  }

  const getPresetRanges = () => {
    const today = new Date()
    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    
    return [
      {
        label: '最近7天',
        start: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
        end: formatDate(today)
      },
      {
        label: '最近30天',
        start: formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)),
        end: formatDate(today)
      },
      {
        label: '最近90天',
        start: formatDate(new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)),
        end: formatDate(today)
      },
      {
        label: '本月',
        start: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        end: formatDate(today)
      },
      {
        label: '上月',
        start: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        end: formatDate(new Date(today.getFullYear(), today.getMonth(), 0))
      }
    ]
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            {formatDateDisplay(startDate, endDate)}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* 预设时间范围 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">快速选择</h4>
              <div className="grid grid-cols-2 gap-2">
                {getPresetRanges().map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setTempStartDate(preset.start)
                      setTempEndDate(preset.end)
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义日期选择 */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">自定义范围</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">开始日期</label>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">结束日期</label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
              >
                取消
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-150"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}