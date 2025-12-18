# Requirements Document

## Introduction

本项目是一个 LeetCode 第2题"两数相加"算法的可视化演示应用。使用 TypeScript + React + D3.js 开发，部署在 GitHub Pages 上。该应用提供类似 IDE Debug 的体验，用户可以逐步观察算法执行过程，包括代码高亮、变量值展示、链表可视化等功能。

## Glossary

- **ListNode**: 单链表节点，包含 val（值）和 next（下一节点指针）属性
- **Carry**: 进位值，两数相加时产生的进位
- **Algorithm Step**: 算法执行的单个步骤，包含当前代码行、变量状态等信息
- **Visualization Panel**: 可视化面板，使用 D3.js 渲染链表图形
- **Code Panel**: 代码面板，展示 Java 代码并高亮当前执行行
- **Control Panel**: 控制面板，包含播放、暂停、上一步、下一步等按钮
- **Debug View**: 调试视图，在代码行后展示变量的内存值
- **Floating Ball**: 悬浮球，用于展示微信交流群二维码

## Requirements

### Requirement 1: 页面标题与导航

**User Story:** As a user, I want to see the problem title matching LeetCode and click to navigate to the original problem, so that I can reference the problem details.

#### Acceptance Criteria

1. WHEN the page loads THEN the System SHALL display the title "2. 两数相加" matching the LeetCode problem title
2. WHEN a user clicks on the title THEN the System SHALL navigate to the LeetCode problem page (https://leetcode.cn/problems/add-two-numbers/) in a new tab
3. WHEN the page loads THEN the System SHALL display a GitHub icon in the top-right corner
4. WHEN a user clicks on the GitHub icon THEN the System SHALL navigate to the repository page (https://github.com/fuck-algorithm/leetcode-2-add-two-numbers) in a new tab

### Requirement 2: 代码展示与语法高亮

**User Story:** As a user, I want to see the Java algorithm code with syntax highlighting and debug-like features, so that I can understand the algorithm execution.

#### Acceptance Criteria

1. WHEN the page loads THEN the System SHALL display the Java solution code with syntax highlighting
2. WHEN an algorithm step is active THEN the System SHALL highlight the currently executing code line with a distinct background color
3. WHEN a variable value changes during execution THEN the System SHALL display the variable's current value inline after the corresponding code line
4. WHEN displaying variable values THEN the System SHALL show values for l1, l2, carry, p, and newHead variables
5. WHEN the code panel renders THEN the System SHALL display line numbers alongside the code

### Requirement 3: 控制面板与键盘快捷键

**User Story:** As a user, I want to control the algorithm visualization with buttons and keyboard shortcuts, so that I can navigate through the algorithm steps efficiently.

#### Acceptance Criteria

1. WHEN a user clicks the "上一步" button or presses the Left Arrow key THEN the System SHALL move to the previous algorithm step
2. WHEN a user clicks the "下一步" button or presses the Right Arrow key THEN the System SHALL move to the next algorithm step
3. WHEN a user clicks the "播放/暂停" button or presses the Space key THEN the System SHALL toggle between auto-play and pause states
4. WHEN displaying control buttons THEN the System SHALL show the corresponding keyboard shortcut text on each button (e.g., "上一步 (←)", "下一步 (→)", "播放 (Space)")
5. WHEN the visualization is at the first step THEN the System SHALL disable the "上一步" button
6. WHEN the visualization is at the last step THEN the System SHALL disable the "下一步" button

### Requirement 4: 链表可视化

**User Story:** As a user, I want to see the linked lists visualized graphically, so that I can understand the data structure and algorithm progress.

#### Acceptance Criteria

1. WHEN the page loads THEN the System SHALL render the input linked lists l1 and l2 using D3.js
2. WHEN the algorithm executes THEN the System SHALL render the result linked list as it is being built
3. WHEN displaying a linked list node THEN the System SHALL show the node value and an arrow pointing to the next node
4. WHEN a pointer (l1, l2, p) moves to a new node THEN the System SHALL visually indicate the current pointer position
5. WHEN the carry value is non-zero THEN the System SHALL display the carry value prominently in the visualization
6. WHEN displaying the visualization THEN the System SHALL show labels for each linked list (l1, l2, result)

### Requirement 5: 算法步骤与状态管理

**User Story:** As a user, I want the visualization to accurately represent each step of the algorithm, so that I can learn how the algorithm works.

#### Acceptance Criteria

1. WHEN the algorithm initializes THEN the System SHALL create step data containing code line number, variable states, and linked list states
2. WHEN generating steps THEN the System SHALL capture the state after each significant operation (variable assignment, pointer movement, node creation)
3. WHEN a step is displayed THEN the System SHALL synchronize the code highlight, variable values, and visualization
4. WHEN auto-play is active THEN the System SHALL advance to the next step at a configurable interval (default 1 second)
5. WHEN the user changes input values THEN the System SHALL regenerate all algorithm steps

### Requirement 6: 微信交流群悬浮球

**User Story:** As a user, I want to see a floating button to join the algorithm discussion group, so that I can connect with other learners.

#### Acceptance Criteria

1. WHEN the page loads THEN the System SHALL display a floating ball in the bottom-right corner with a WeChat group icon and "交流群" text
2. WHEN a user hovers over the floating ball THEN the System SHALL display a popup with the WeChat QR code image
3. WHEN displaying the QR code popup THEN the System SHALL show the text "使用微信扫码发送 leetcode 加入算法交流群"
4. WHEN displaying the QR code image THEN the System SHALL maintain the original aspect ratio of the image
5. WHEN a user moves the mouse away from the floating ball THEN the System SHALL hide the QR code popup

### Requirement 7: GitHub Actions 自动部署

**User Story:** As a developer, I want the project to automatically deploy to GitHub Pages when code is pushed, so that the latest version is always available.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch THEN the GitHub Action SHALL trigger the build and deploy workflow
2. WHEN the build process runs THEN the GitHub Action SHALL execute linting checks before building
3. WHEN linting or build fails THEN the GitHub Action SHALL fail the workflow and report errors
4. WHEN the build succeeds THEN the GitHub Action SHALL deploy the built files to GitHub Pages
5. WHEN the deployment completes THEN the System SHALL be accessible via the GitHub Pages URL

### Requirement 8: 单屏幕布局

**User Story:** As a user, I want all content to fit on a single screen without scrolling, so that I can see all information at once.

#### Acceptance Criteria

1. WHEN the page loads THEN the System SHALL display all components (header, code panel, visualization panel, control panel) within the viewport
2. WHEN the window is resized THEN the System SHALL adjust component sizes to maintain single-screen layout
3. WHEN displaying the layout THEN the System SHALL use a responsive design that works on common screen sizes (1280x720 and above)
