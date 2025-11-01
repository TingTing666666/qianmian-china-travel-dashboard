"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'

interface Node {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    description: string
    inputs: { name: string; type: string; description: string }[]
    outputs: { name: string; type: string; description: string }[]
    color: string
    icon: string
    config: { [key: string]: any }
  }
}

interface Connection {
  id: string
  source: string
  target: string
  sourceOutput: string
  targetInput: string
}

export default function WorkflowPage() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'input-1',
      type: 'input',
      position: { x: 100, y: 200 },
      data: {
        label: '视频输入源',
        description: '支持多种视频格式的输入处理模块，包含预处理和格式转换功能',
        inputs: [],
        outputs: [
          { name: 'video_stream', type: 'VideoStream', description: '原始视频流数据' },
          { name: 'metadata', type: 'Object', description: '视频元数据信息' }
        ],
        color: '#3B82F6',
        icon: '🎥',
        config: {
          supportedFormats: ['MP4', 'AVI', 'MOV', 'MKV', 'WMV'],
          maxFileSize: '2GB',
          resolution: 'Auto-detect',
          frameRate: 'Variable'
        }
      }
    },
    {
      id: 'whisper-1',
      type: 'processor',
      position: { x: 400, y: 150 },
      data: {
        label: 'Whisper语音转录',
        description: '基于OpenAI Whisper模型的高精度多语言语音识别系统',
        inputs: [
          { name: 'video_stream', type: 'VideoStream', description: '输入视频流' },
          { name: 'audio_config', type: 'Object', description: '音频处理配置' }
        ],
        outputs: [
          { name: 'transcript', type: 'String', description: '转录文本内容' },
          { name: 'timestamps', type: 'Array', description: '时间戳信息' },
          { name: 'confidence', type: 'Number', description: '识别置信度' }
        ],
        color: '#8B5CF6',
        icon: '🎤',
        config: {
          model: 'whisper-large-v3',
          language: 'auto-detect',
          temperature: 0.0,
          beam_size: 5,
          best_of: 5,
          patience: 1.0
        }
      }
    },
    {
      id: 'translate-1',
      type: 'processor',
      position: { x: 700, y: 100 },
      data: {
        label: '智能翻译引擎',
        description: '基于大语言模型的上下文感知翻译系统，支持100+语言对',
        inputs: [
          { name: 'source_text', type: 'String', description: '源语言文本' },
          { name: 'context', type: 'Object', description: '上下文信息' }
        ],
        outputs: [
          { name: 'translated_text', type: 'String', description: '翻译后文本' },
          { name: 'translation_quality', type: 'Number', description: '翻译质量评分' },
          { name: 'detected_language', type: 'String', description: '检测到的源语言' }
        ],
        color: '#06B6D4',
        icon: '🌐',
        config: {
          targetLanguage: 'zh-CN',
          model: 'gpt-4-turbo',
          preserveFormatting: true,
          contextWindow: 4096,
          qualityThreshold: 0.85
        }
      }
    },
    {
      id: 'qianmian-1',
      type: 'processor',
      position: { x: 1000, y: 200 },
      data: {
        label: '千面内容分析',
        description: '多维度深度内容理解与分析系统，提供情感、主题、结构等全方位洞察',
        inputs: [
          { name: 'text_content', type: 'String', description: '文本内容' },
          { name: 'video_features', type: 'Object', description: '视频特征数据' },
          { name: 'metadata', type: 'Object', description: '元数据信息' }
        ],
        outputs: [
          { name: 'content_analysis', type: 'Object', description: '内容分析结果' },
          { name: 'sentiment_score', type: 'Number', description: '情感分析评分' },
          { name: 'key_topics', type: 'Array', description: '关键主题提取' },
          { name: 'structure_info', type: 'Object', description: '内容结构信息' }
        ],
        color: '#EC4899',
        icon: '🧠',
        config: {
          analysisDepth: 'comprehensive',
          sentimentModel: 'bert-large-chinese',
          topicModel: 'lda-optimized',
          structureAnalysis: true,
          culturalContext: 'chinese'
        }
      }
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 1300, y: 250 },
      data: {
        label: '分析报告生成',
        description: '生成结构化的综合分析报告，支持多种输出格式和可视化展示',
        inputs: [
          { name: 'analysis_data', type: 'Object', description: '分析数据集合' },
          { name: 'report_config', type: 'Object', description: '报告配置参数' }
        ],
        outputs: [],
        color: '#10B981',
        icon: '📊',
        config: {
          outputFormat: ['JSON', 'PDF', 'HTML'],
          includeCharts: true,
          language: 'zh-CN',
          detailLevel: 'comprehensive',
          exportPath: './reports/'
        }
      }
    }
  ])

  const [connections, setConnections] = useState<Connection[]>([
    { id: 'conn-1', source: 'input-1', target: 'whisper-1', sourceOutput: 'video_stream', targetInput: 'video_stream' },
    { id: 'conn-2', source: 'whisper-1', target: 'translate-1', sourceOutput: 'transcript', targetInput: 'source_text' },
    { id: 'conn-3', source: 'translate-1', target: 'qianmian-1', sourceOutput: 'translated_text', targetInput: 'text_content' },
    { id: 'conn-4', source: 'input-1', target: 'qianmian-1', sourceOutput: 'metadata', targetInput: 'metadata' },
    { id: 'conn-5', source: 'qianmian-1', target: 'output-1', sourceOutput: 'content_analysis', targetInput: 'analysis_data' }
  ])

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showJson, setShowJson] = useState(false)
  const [activeTab, setActiveTab] = useState<'properties' | 'config' | 'connections'>('properties')
  const canvasRef = useRef<HTMLDivElement>(null)

  const nodeTypes = [
    { type: 'input', label: '数据输入', color: '#3B82F6', icon: '📥', description: '数据源和输入处理' },
    { type: 'processor', label: '处理模块', color: '#8B5CF6', icon: '⚙️', description: '数据处理和转换' },
    { type: 'output', label: '结果输出', color: '#10B981', icon: '📤', description: '结果输出和导出' },
    { type: 'condition', label: '条件判断', color: '#F59E0B', icon: '🔀', description: '条件分支处理' },
    { type: 'loop', label: '循环处理', color: '#EF4444', icon: '🔄', description: '循环和迭代处理' },
    { type: 'transform', label: '数据转换', color: '#06B6D4', icon: '🔄', description: '数据格式转换' }
  ]

  const handleNodeClick = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    setSelectedNode(nodeId)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    setSelectedNode(nodeId)
    setIsDragging(true)
    
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }, [nodes])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedNode || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragOffset.x
    const newY = e.clientY - canvasRect.top - dragOffset.y

    setNodes(prev => prev.map(node => 
      node.id === selectedNode 
        ? { ...node, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
        : node
    ))
  }, [isDragging, selectedNode, dragOffset])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleCanvasClick = useCallback(() => {
    if (!isDragging) {
      setSelectedNode(null)
    }
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const addNode = (type: string) => {
    const nodeType = nodeTypes.find(t => t.type === type)
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 300, y: 300 },
      data: {
        label: `新${nodeType?.label || '节点'}`,
        description: nodeType?.description || '请配置节点参数',
        inputs: type === 'input' ? [] : [{ name: 'input', type: 'Any', description: '输入数据' }],
        outputs: type === 'output' ? [] : [{ name: 'output', type: 'Any', description: '输出数据' }],
        color: nodeType?.color || '#6B7280',
        icon: nodeType?.icon || '⚙️',
        config: {}
      }
    }
    setNodes(prev => [...prev, newNode])
    setSelectedNode(newNode.id)
  }

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    setConnections(prev => prev.filter(c => c.source !== nodeId && c.target !== nodeId))
    setSelectedNode(null)
  }

  const updateNodeProperty = (nodeId: string, property: string, value: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, [property]: value } }
        : node
    ))
  }

  const exportToJson = () => {
    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        label: node.data.label,
        description: node.data.description,
        inputs: node.data.inputs,
        outputs: node.data.outputs,
        config: node.data.config
      })),
      connections: connections.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        sourceOutput: conn.sourceOutput,
        targetInput: conn.targetInput
      })),
      metadata: {
        name: "千面大模型分析工作流",
        version: "2.0.0",
        created: new Date().toISOString(),
        description: "专业视频内容智能分析处理流程",
        author: "千面AI团队",
        tags: ["视频分析", "AI处理", "内容理解"]
      }
    }
    return JSON.stringify(workflow, null, 2)
  }

  const getConnectionPath = (source: Node, target: Node) => {
    const sourceX = source.position.x + 240
    const sourceY = source.position.y + 60
    const targetX = target.position.x
    const targetY = target.position.y + 60
    
    const midX = (sourceX + targetX) / 2
    
    return `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`
  }

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">千</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">工作流编辑器</h1>
          </div>
          <div className="flex space-x-2">
            {nodeTypes.map(nodeType => (
              <button
                key={nodeType.type}
                onClick={() => addNode(nodeType.type)}
                className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
                title={nodeType.description}
              >
                <span>{nodeType.icon}</span>
                <span className="text-gray-700">{nodeType.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowJson(!showJson)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            {showJson ? '隐藏代码' : '查看代码'}
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm">
            保存工作流
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm">
            运行测试
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧属性面板 */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">节点配置</h3>
            <div className="flex space-x-1 mt-3">
              <button
                onClick={() => setActiveTab('properties')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeTab === 'properties' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                属性
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeTab === 'config' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                配置
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeTab === 'connections' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                连接
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedNodeData ? (
              <div className="space-y-6">
                {activeTab === 'properties' && (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                        style={{ backgroundColor: selectedNodeData.data.color }}
                      >
                        {selectedNodeData.data.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{selectedNodeData.data.label}</h4>
                        <p className="text-sm text-gray-500">{selectedNodeData.type}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">节点名称</label>
                        <input
                          type="text"
                          value={selectedNodeData.data.label}
                          onChange={(e) => updateNodeProperty(selectedNodeData.id, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">描述信息</label>
                        <textarea
                          value={selectedNodeData.data.description}
                          onChange={(e) => updateNodeProperty(selectedNodeData.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                        />
                      </div>
                      
                      {selectedNodeData.data.inputs.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">输入端口</label>
                          <div className="space-y-2">
                            {selectedNodeData.data.inputs.map((input, index) => (
                              <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-900">{input.name}</span>
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{input.type}</span>
                                </div>
                                <p className="text-xs text-gray-600 ml-5">{input.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedNodeData.data.outputs.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">输出端口</label>
                          <div className="space-y-2">
                            {selectedNodeData.data.outputs.map((output, index) => (
                              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-900">{output.name}</span>
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{output.type}</span>
                                </div>
                                <p className="text-xs text-gray-600 ml-5">{output.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {activeTab === 'config' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">节点配置参数</h4>
                    {Object.keys(selectedNodeData.data.config).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(selectedNodeData.data.config).map(([key, value]) => (
                          <div key={key} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{key}</span>
                              <span className="text-xs text-gray-500">{typeof value}</span>
                            </div>
                            <div className="text-sm text-gray-600 font-mono bg-white p-2 rounded border">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">暂无配置参数</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'connections' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">节点连接</h4>
                    <div className="space-y-3">
                      {connections.filter(conn => conn.source === selectedNodeData.id || conn.target === selectedNodeData.id).map(conn => (
                        <div key={conn.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">
                                {conn.source === selectedNodeData.id ? '输出到' : '输入自'}
                              </span>
                              <span className="text-blue-600">
                                {nodes.find(n => n.id === (conn.source === selectedNodeData.id ? conn.target : conn.source))?.data.label}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {conn.sourceOutput} → {conn.targetInput}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => deleteNode(selectedNodeData.id)}
                    className="w-full px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    删除节点
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-gray-500 mb-2">选择一个节点</p>
                <p className="text-sm text-gray-400">点击画布中的节点来查看和编辑其属性</p>
              </div>
            )}
          </div>
        </div>

        {/* 主画布区域 */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative bg-white"
            style={{
              backgroundImage: `
                radial-gradient(circle, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
            onClick={handleCanvasClick}
          >
            {/* SVG连接线 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6B7280"
                  />
                </marker>
              </defs>
              {connections.map(connection => {
                const sourceNode = nodes.find(n => n.id === connection.source)
                const targetNode = nodes.find(n => n.id === connection.target)
                if (!sourceNode || !targetNode) return null
                
                return (
                  <path
                    key={connection.id}
                    d={getConnectionPath(sourceNode, targetNode)}
                    stroke="#6B7280"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="drop-shadow-sm"
                  />
                )
              })}
            </svg>

            {/* 节点 */}
            {nodes.map(node => (
              <div
                key={node.id}
                className={`absolute w-60 bg-white border-2 rounded-xl shadow-lg cursor-move transition-all duration-200 ${
                  selectedNode === node.id 
                    ? 'border-blue-500 shadow-blue-200 shadow-xl' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }`}
                style={{
                  left: node.position.x,
                  top: node.position.y
                }}
                onClick={(e) => handleNodeClick(e, node.id)}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
              >
                {/* 节点头部 */}
                <div 
                  className="p-4 rounded-t-xl text-white font-medium flex items-center space-x-3"
                  style={{ backgroundColor: node.data.color }}
                >
                  <span className="text-xl">{node.data.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold truncate">{node.data.label}</div>
                    <div className="text-xs opacity-90">{node.type}</div>
                  </div>
                </div>
                
                {/* 节点内容 */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{node.data.description}</p>
                  
                  {/* 输入端口 */}
                  {node.data.inputs.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-500 mb-2">输入端口</div>
                      {node.data.inputs.map((input, index) => (
                        <div key={index} className="flex items-center mb-2 last:mb-0">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">{input.name}</div>
                            <div className="text-xs text-gray-500 truncate">{input.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 输出端口 */}
                  {node.data.outputs.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-2">输出端口</div>
                      {node.data.outputs.map((output, index) => (
                        <div key={index} className="flex items-center justify-end mb-2 last:mb-0">
                          <div className="flex-1 min-w-0 text-right mr-3">
                            <div className="text-xs font-medium text-gray-900 truncate">{output.name}</div>
                            <div className="text-xs text-gray-500 truncate">{output.type}</div>
                          </div>
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧JSON面板 */}
        {showJson && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">工作流代码</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exportToJson())
                    alert('代码已复制到剪贴板')
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  复制代码
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto font-mono border">
                <code>{exportToJson()}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">工作流就绪</span>
          </div>
          <span className="text-gray-500">节点: {nodes.length}</span>
          <span className="text-gray-500">连接: {connections.length}</span>
          {selectedNode && (
            <span className="text-blue-600">已选择: {nodes.find(n => n.id === selectedNode)?.data.label}</span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-gray-400">
          <span>千面工作流编辑器 v2.0</span>
          <span>•</span>
          <span>专业版</span>
        </div>
      </div>
    </div>
  )
}