import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ListNodeState, PointerState } from '../core/types'
import './VisualizationPanel.css'

interface VisualizationPanelProps {
  l1State: ListNodeState | null
  l2State: ListNodeState | null
  resultState: ListNodeState | null
  pointers: PointerState
  carry: number
}

const NODE_WIDTH = 60
const NODE_HEIGHT = 50
const NODE_SPACING = 100
const LABEL_WIDTH = 80
const ROW_SPACING = 120 // 行间距

export function VisualizationPanel({
  l1State,
  l2State,
  resultState,
  pointers,
  carry,
}: VisualizationPanelProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const containerWidth = svgRef.current.clientWidth
    const containerHeight = svgRef.current.clientHeight || 500

    // 计算内容所需的宽度和高度
    const maxNodes = Math.max(
      l1State?.values.length || 0,
      l2State?.values.length || 0,
      resultState?.values.length || 0,
      3
    )
    const contentWidth = LABEL_WIDTH + 40 + maxNodes * NODE_SPACING + 250 // 额外空间给进位显示
    const contentHeight = 520 // 内容总高度（增加）

    // 计算居中偏移
    const offsetX = Math.max(20, (containerWidth - contentWidth) / 2)
    const offsetY = Math.max(50, (containerHeight - contentHeight) / 2)

    // 计算布局 - 使用相对位置，增加行间距
    const startX = LABEL_WIDTH + 40 + offsetX
    const l1Y = 70 + offsetY
    const l2Y = l1Y + ROW_SPACING
    const computeY = l2Y + ROW_SPACING + 20
    const resultY = computeY + ROW_SPACING + 10

    // 创建主容器
    const g = svg.append('g')

    // 绘制标题区域
    drawTitle(g, containerWidth / 2, offsetY - 20)

    // 绘制 l1 链表区域
    drawListSection(g, l1State, 'l1', '链表 l1 (第一个加数)', startX, l1Y, pointers.l1Position, '#60a5fa')

    // 绘制 l2 链表区域
    drawListSection(g, l2State, 'l2', '链表 l2 (第二个加数)', startX, l2Y, pointers.l2Position, '#f472b6')

    // 获取当前值
    const currentL1Val: number | null = l1State && pointers.l1Position >= 0 && pointers.l1Position < l1State.values.length
      ? l1State.values[pointers.l1Position] ?? null
      : null
    const currentL2Val: number | null = l2State && pointers.l2Position >= 0 && pointers.l2Position < l2State.values.length
      ? l2State.values[pointers.l2Position] ?? null
      : null

    // 计算位置
    const currentPos = Math.max(pointers.l1Position, pointers.l2Position, 0)
    const computeX = startX + currentPos * NODE_SPACING + NODE_WIDTH / 2

    // 绘制数据流箭头（从 l1 到计算区域）- 调整位置避免遮挡
    if (pointers.l1Position >= 0 && currentL1Val !== null) {
      const l1NodeX = startX + pointers.l1Position * NODE_SPACING + NODE_WIDTH / 2
      drawDataFlow(g, l1NodeX, l1Y + NODE_HEIGHT + 25, computeX - 50, computeY - 30, '#60a5fa', currentL1Val, 'l1取值')
    }

    // 绘制数据流箭头（从 l2 到计算区域）- 调整位置避免遮挡
    if (pointers.l2Position >= 0 && currentL2Val !== null) {
      const l2NodeX = startX + pointers.l2Position * NODE_SPACING + NODE_WIDTH / 2
      drawDataFlow(g, l2NodeX, l2Y + NODE_HEIGHT + 25, computeX + 50, computeY - 30, '#f472b6', currentL2Val, 'l2取值')
    }

    // 计算当前位的和与新进位
    const sum = (currentL1Val ?? 0) + (currentL2Val ?? 0) + carry
    const newCarry = Math.floor(sum / 10)

    // 绘制计算区域
    drawComputeArea(g, computeX, computeY, currentL1Val, currentL2Val, carry)

    // 绘制进位显示 - 放在内容区域右侧，增加间距
    const carryDisplayX = startX + maxNodes * NODE_SPACING + 80
    drawCarryDisplay(g, carryDisplayX, computeY - 50, carry)

    // 绘制从进位框到计算区域的箭头（当有上轮进位时）
    if (carry > 0) {
      drawCarryToCompute(g, carryDisplayX, computeY - 50, computeX, computeY, carry)
    }

    // 绘制进位流向（如果产生了新进位）
    if (newCarry > 0) {
      drawCarryFlow(g, computeX, computeY, carryDisplayX, computeY - 50, newCarry)
    }

    // 绘制从计算区域到结果的箭头
    if (resultState && resultState.values.length > 0) {
      const resultX = startX + (resultState.values.length - 1) * NODE_SPACING + NODE_WIDTH / 2
      drawResultFlow(g, computeX, computeY + 65, resultX, resultY - 25, sum % 10)
    }

    // 绘制结果链表区域
    drawListSection(g, resultState, '结果', '结果链表 (和)', startX, resultY, pointers.pPosition, '#4ade80', true)

    // 绘制数字含义说明
    drawNumberMeaning(g, startX, l1Y, l1State, '342')
    drawNumberMeaning(g, startX, l2Y, l2State, '465')
    if (resultState && resultState.values.length > 0) {
      const resultNum = resultState.values.slice().reverse().join('')
      drawNumberMeaning(g, startX, resultY, resultState, resultNum)
    }

    // 绘制状态图例
    drawLegend(g, containerWidth - 180, offsetY + 10)

  }, [l1State, l2State, resultState, pointers, carry])

  return (
    <div className="visualization-panel" data-testid="visualization-panel">
      <svg ref={svgRef} className="visualization-svg" />
    </div>
  )
}

function drawTitle(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number
) {
  g.append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('class', 'viz-title')
    .text('两数相加 - 链表逐位相加过程')
}

function drawListSection(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  state: ListNodeState | null,
  labelId: string,
  title: string,
  startX: number,
  y: number,
  pointerPosition: number,
  color: string,
  isResult: boolean = false
) {
  // 标签起始位置（在节点区域左侧）
  const labelX = startX - LABEL_WIDTH - 20

  // 绘制区域标题
  g.append('text')
    .attr('x', labelX)
    .attr('y', y - 15)
    .attr('class', 'section-title')
    .attr('fill', color)
    .text(title)

  // 绘制标签
  g.append('text')
    .attr('x', labelX + 5)
    .attr('y', y + NODE_HEIGHT / 2 + 5)
    .attr('class', 'list-label')
    .attr('data-testid', `label-${labelId}`)
    .attr('fill', color)
    .text(labelId)

  if (!state || state.values.length === 0) {
    g.append('text')
      .attr('x', startX)
      .attr('y', y + NODE_HEIGHT / 2 + 5)
      .attr('class', 'null-indicator')
      .text(isResult ? 'newHead' : 'null (空链表)')
    return
  }

  state.values.forEach((value, index) => {
    const x = startX + index * NODE_SPACING
    const isCurrentPointer = index === pointerPosition
    const isPastPointer = pointerPosition >= 0 && index < pointerPosition
    const isFuturePointer = pointerPosition >= 0 && index > pointerPosition

    // 确定节点状态
    let nodeStatus: 'waiting' | 'computing' | 'computed'
    if (isCurrentPointer) {
      nodeStatus = 'computing'
    } else if (isPastPointer) {
      nodeStatus = 'computed'
    } else {
      nodeStatus = 'waiting'
    }

    const nodeGroup = g.append('g').attr('transform', `translate(${x}, ${y})`)

    // 节点背景光晕（当前节点）
    if (isCurrentPointer) {
      nodeGroup
        .append('rect')
        .attr('x', -5)
        .attr('y', -5)
        .attr('width', NODE_WIDTH + 10)
        .attr('height', NODE_HEIGHT + 10)
        .attr('rx', 10)
        .attr('class', 'node-glow')
        .attr('fill', color)
        .attr('opacity', 0.2)
    }

    // 节点矩形 - 根据状态设置不同样式
    const nodeRect = nodeGroup
      .append('rect')
      .attr('width', NODE_WIDTH)
      .attr('height', NODE_HEIGHT)
      .attr('rx', 6)
      .attr('class', `node-rect ${nodeStatus} ${isResult ? 'result-node' : ''}`)
      .attr('data-testid', `node-${labelId}-${index}`)
    
    if (isCurrentPointer) {
      nodeRect.style('stroke', color)
    }

    // 节点值 - 根据状态设置不同文字样式
    let textClass = 'node-value'
    if (nodeStatus === 'computing') {
      textClass += ' computing-text'
    } else if (nodeStatus === 'computed') {
      textClass += ' computed-text'
    } else if (isFuturePointer || nodeStatus === 'waiting') {
      textClass += ' waiting-text'
    }

    nodeGroup
      .append('text')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', NODE_HEIGHT / 2 + 6)
      .attr('class', textClass)
      .attr('data-testid', `node-value-${labelId}-${index}`)
      .text(value)

    // 位权标注（10的几次方）
    const power = index
    nodeGroup
      .append('text')
      .attr('x', NODE_WIDTH / 2)
      .attr('y', NODE_HEIGHT + 18)
      .attr('class', 'power-label')
      .text(`×10${power === 0 ? '⁰' : power === 1 ? '¹' : power === 2 ? '²' : `^${power}`}`)

    // 当前指针标记
    if (isCurrentPointer) {
      const pointerLabel = isResult ? 'p →' : `${labelId} →`
      
      nodeGroup
        .append('path')
        .attr('d', `M${NODE_WIDTH / 2},${-12} L${NODE_WIDTH / 2 - 8},${-4} L${NODE_WIDTH / 2 + 8},${-4} Z`)
        .attr('fill', color)
      
      nodeGroup
        .append('text')
        .attr('x', NODE_WIDTH / 2)
        .attr('y', -18)
        .attr('class', 'pointer-label')
        .attr('data-testid', `pointer-${labelId}`)
        .attr('fill', color)
        .text(pointerLabel)
    }

    // 箭头到下一个节点
    if (index < state.values.length - 1) {
      drawNodeArrow(nodeGroup, NODE_WIDTH, NODE_HEIGHT / 2, NODE_SPACING - NODE_WIDTH)
    } else {
      drawNullIndicator(nodeGroup, NODE_WIDTH, NODE_HEIGHT / 2)
    }
  })
}

function drawNodeArrow(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number,
  length: number
) {
  const arrowGroup = g.append('g').attr('class', 'arrow')

  arrowGroup
    .append('line')
    .attr('x1', x + 5)
    .attr('y1', y)
    .attr('x2', x + length - 8)
    .attr('y2', y)
    .attr('class', 'arrow-line')
    .attr('data-testid', 'arrow')

  arrowGroup
    .append('path')
    .attr('d', `M${x + length - 8},${y - 5} L${x + length},${y} L${x + length - 8},${y + 5}`)
    .attr('class', 'arrow-head-fill')
}

function drawNullIndicator(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number
) {
  g.append('line')
    .attr('x1', x + 5)
    .attr('y1', y)
    .attr('x2', x + 20)
    .attr('y2', y)
    .attr('class', 'arrow-line')

  g.append('text')
    .attr('x', x + 28)
    .attr('y', y + 5)
    .attr('class', 'null-text')
    .attr('data-testid', 'null-indicator')
    .text('null')
}

function drawDataFlow(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  value: number,
  label: string = '取值'
) {
  const flowGroup = g.append('g').attr('class', 'flow-arrow')

  // 曲线路径
  const midY = (y1 + y2) / 2
  flowGroup
    .append('path')
    .attr('d', `M${x1},${y1} Q${x1},${midY} ${x2},${y2}`)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '8,4')
    .attr('class', 'flow-line')
    .attr('opacity', 0.9)

  // 箭头头部
  flowGroup
    .append('circle')
    .attr('cx', x2)
    .attr('cy', y2)
    .attr('r', 6)
    .attr('fill', color)

  // 数值气泡
  const bubbleX = (x1 + x2) / 2
  const bubbleY = midY
  
  flowGroup
    .append('circle')
    .attr('cx', bubbleX)
    .attr('cy', bubbleY)
    .attr('r', 18)
    .attr('fill', color)

  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY + 6)
    .attr('class', 'flow-value')
    .text(value)

  // 标签说明
  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY - 25)
    .attr('class', 'data-flow-label')
    .attr('fill', color)
    .text(label)
}

function drawComputeArea(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number,
  l1Val: number | null,
  l2Val: number | null,
  carry: number
) {
  const boxWidth = 180
  const boxHeight = 100
  const computeGroup = g.append('g').attr('transform', `translate(${x - boxWidth / 2}, ${y - 30})`)

  // 计算区域背景
  computeGroup
    .append('rect')
    .attr('width', boxWidth)
    .attr('height', boxHeight)
    .attr('rx', 12)
    .attr('class', 'compute-box')

  // 标题
  computeGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 22)
    .attr('class', 'compute-title')
    .text('⚡ 当前位计算')

  // 计算表达式
  const v1 = l1Val ?? 0
  const v2 = l2Val ?? 0
  const sum = v1 + v2 + carry
  const digit = sum % 10
  const newCarry = Math.floor(sum / 10)

  // 显示完整计算过程
  computeGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 48)
    .attr('class', 'compute-expression')
    .text(`${v1} + ${v2} + ${carry} = ${sum}`)

  // 显示结果分解
  computeGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 70)
    .attr('class', 'compute-result')
    .text(`结果位: ${digit}  |  新进位: ${newCarry}`)

  // 结果高亮
  computeGroup
    .append('rect')
    .attr('x', boxWidth / 2 - 28)
    .attr('y', 78)
    .attr('width', 56)
    .attr('height', 26)
    .attr('rx', 5)
    .attr('class', 'result-highlight')

  computeGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 97)
    .attr('class', 'result-digit')
    .text(digit)
}

function drawCarryDisplay(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number,
  carry: number
) {
  const boxWidth = 140
  const boxHeight = 120
  const carryGroup = g.append('g').attr('transform', `translate(${x}, ${y})`)

  // 进位框
  carryGroup
    .append('rect')
    .attr('width', boxWidth)
    .attr('height', boxHeight)
    .attr('rx', 14)
    .attr('class', carry > 0 ? 'carry-box active' : 'carry-box')

  // 进位图标
  carryGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 28)
    .attr('class', 'carry-icon')
    .text(carry > 0 ? '�' :  '📭')

  // 进位标签 - 改为更清晰的说明
  carryGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 50)
    .attr('class', 'carry-label')
    .text('上轮进位')

  // 说明文字
  carryGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 68)
    .attr('class', 'carry-hint')
    .text('(参与本轮计算)')

  // 进位值
  carryGroup
    .append('text')
    .attr('x', boxWidth / 2)
    .attr('y', 100)
    .attr('class', carry > 0 ? 'carry-value active' : 'carry-value')
    .attr('data-testid', 'carry-display')
    .text(carry)
}

function drawResultFlow(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  value: number
) {
  const flowGroup = g.append('g').attr('class', 'result-flow')

  // 曲线路径
  flowGroup
    .append('path')
    .attr('d', `M${x1},${y1} Q${x1},${(y1 + y2) / 2} ${x2},${y2}`)
    .attr('fill', 'none')
    .attr('stroke', '#4ade80')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '8,4')
    .attr('class', 'flow-line')

  // 箭头
  flowGroup
    .append('circle')
    .attr('cx', x2)
    .attr('cy', y2)
    .attr('r', 6)
    .attr('fill', '#4ade80')

  // 数值气泡
  const bubbleX = (x1 + x2) / 2
  const bubbleY = (y1 + y2) / 2
  
  flowGroup
    .append('circle')
    .attr('cx', bubbleX)
    .attr('cy', bubbleY)
    .attr('r', 18)
    .attr('fill', '#4ade80')

  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY + 6)
    .attr('class', 'result-flow-value')
    .text(value)

  // 标签
  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY - 25)
    .attr('class', 'flow-label')
    .text('写入结果')
}

function drawNumberMeaning(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  startX: number,
  y: number,
  state: ListNodeState | null,
  displayNum: string
) {
  if (!state || state.values.length === 0) return

  const endX = startX + (state.values.length - 1) * NODE_SPACING + NODE_WIDTH + 40

  g.append('text')
    .attr('x', endX)
    .attr('y', y + NODE_HEIGHT / 2 + 5)
    .attr('class', 'number-meaning')
    .text(`= ${displayNum}`)
}

function drawCarryToCompute(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  carryBoxX: number,
  carryBoxY: number,
  computeX: number,
  computeY: number,
  carry: number
) {
  const flowGroup = g.append('g').attr('class', 'carry-input-flow')

  // 从进位框到计算区域的箭头
  const startX = carryBoxX
  const startY = carryBoxY + 60
  const endX = computeX + 90
  const endY = computeY - 10

  // 曲线箭头
  flowGroup
    .append('path')
    .attr('d', `M${startX},${startY} Q${startX - 40},${(startY + endY) / 2} ${endX},${endY}`)
    .attr('fill', 'none')
    .attr('stroke', '#ffa116')
    .attr('stroke-width', 2.5)
    .attr('stroke-dasharray', '6,3')
    .attr('class', 'carry-flow-line')

  // 箭头头部
  flowGroup
    .append('circle')
    .attr('cx', endX)
    .attr('cy', endY)
    .attr('r', 5)
    .attr('fill', '#ffa116')

  // 数值气泡
  const bubbleX = (startX + endX) / 2 - 20
  const bubbleY = (startY + endY) / 2
  
  flowGroup
    .append('circle')
    .attr('cx', bubbleX)
    .attr('cy', bubbleY)
    .attr('r', 16)
    .attr('fill', '#ffa116')

  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY + 5)
    .attr('class', 'flow-value')
    .text(carry)

  // 标签
  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY - 22)
    .attr('class', 'carry-flow-label')
    .text('+进位')
}

function drawCarryFlow(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  computeX: number,
  computeY: number,
  carryBoxX: number,
  carryBoxY: number,
  newCarry: number
) {
  const flowGroup = g.append('g').attr('class', 'carry-flow')

  // 从计算区域右侧到进位框左侧的箭头
  const startX = computeX + 90
  const startY = computeY + 20
  const endX = carryBoxX
  const endY = carryBoxY + 60

  // 曲线箭头
  flowGroup
    .append('path')
    .attr('d', `M${startX},${startY} Q${(startX + endX) / 2},${startY + 30} ${endX},${endY}`)
    .attr('fill', 'none')
    .attr('stroke', '#ffa116')
    .attr('stroke-width', 2.5)
    .attr('stroke-dasharray', '6,3')
    .attr('class', 'carry-flow-line')

  // 箭头头部
  flowGroup
    .append('circle')
    .attr('cx', endX)
    .attr('cy', endY)
    .attr('r', 5)
    .attr('fill', '#ffa116')

  // 数值气泡 - 显示新进位值
  const bubbleX = (startX + endX) / 2
  const bubbleY = startY + 15
  
  flowGroup
    .append('circle')
    .attr('cx', bubbleX)
    .attr('cy', bubbleY)
    .attr('r', 16)
    .attr('fill', '#ffa116')

  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY + 5)
    .attr('class', 'flow-value')
    .text(newCarry)

  // 标签
  flowGroup
    .append('text')
    .attr('x', bubbleX)
    .attr('y', bubbleY + 28)
    .attr('class', 'carry-flow-label')
    .text('新进位→下轮')
}

function drawLegend(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: number,
  y: number
) {
  const legendGroup = g.append('g')
    .attr('class', 'legend-group')
    .attr('transform', `translate(${x}, ${y})`)

  // 图例标题
  legendGroup
    .append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('class', 'legend-title')
    .text('节点状态')

  const items = [
    { label: '等待计算', className: 'waiting', color: '#4a5568' },
    { label: '计算中', className: 'computing', color: '#3b82f6' },
    { label: '已计算', className: 'computed', color: '#22c55e' },
  ]

  items.forEach((item, index) => {
    const itemY = 20 + index * 28

    // 状态方块
    legendGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', itemY)
      .attr('width', 20)
      .attr('height', 16)
      .attr('class', `legend-rect ${item.className}`)

    // 状态文字
    legendGroup
      .append('text')
      .attr('x', 28)
      .attr('y', itemY + 12)
      .attr('class', 'legend-text')
      .text(item.label)
  })
}
