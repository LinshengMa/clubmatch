# Skill: Tinder 滑动交互（Swipe Cards）

## 核心实现原理

使用 React state 追踪拖拽偏移量，CSS transform 实现跟手效果，超过阈值后触发飞出动画。

---

## SwipeCard 组件实现

```jsx
// src/components/SwipeCard.jsx
import { useState, useRef } from 'react';

const SWIPE_THRESHOLD = 120; // 超过此距离才触发滑动
const MAX_ROTATION = 15;     // 最大旋转角度

export const SwipeCard = ({ card, onSwipeLeft, onSwipeRight, isTop, stackIndex }) => {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // 叠层样式：第0张完整，第1张缩小8px偏移，第2张更小16px偏移
  const stackStyle = {
    transform: isTop
      ? `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`
      : `scale(${1 - stackIndex * 0.05}) translateY(${stackIndex * 8}px)`,
    zIndex: 10 - stackIndex,
    transition: dragging ? 'none' : 'transform 0.3s ease',
    cursor: isTop ? 'grab' : 'default',
  };

  const rotation = isTop ? (offset.x / 300) * MAX_ROTATION : 0;
  const direction = offset.x > 50 ? 'right' : offset.x < -50 ? 'left' : null;

  // 鼠标事件
  const handleMouseDown = (e) => {
    if (!isTop) return;
    setDragging(true);
    startPos.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (offset.x > SWIPE_THRESHOLD) {
      flyOut('right');
    } else if (offset.x < -SWIPE_THRESHOLD) {
      flyOut('left');
    } else {
      setOffset({ x: 0, y: 0 }); // 弹回原位
    }
  };

  const flyOut = (direction) => {
    const target = direction === 'right' ? 1000 : -1000;
    setOffset({ x: target, y: offset.y });
    setTimeout(() => {
      direction === 'right' ? onSwipeRight(card) : onSwipeLeft(card);
    }, 300);
  };

  // 触摸事件（同逻辑）
  const handleTouchStart = (e) => {
    if (!isTop) return;
    const touch = e.touches[0];
    setDragging(true);
    startPos.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
  };
  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setOffset({ x: touch.clientX - startPos.current.x, y: touch.clientY - startPos.current.y });
  };
  const handleTouchEnd = handleMouseUp;

  return (
    <div
      ref={cardRef}
      style={stackStyle}
      className="absolute w-80 rounded-2xl bg-white shadow-xl overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stamp 标签（拖动时显示） */}
      {isTop && direction === 'right' && (
        <div className="absolute top-6 left-6 border-4 border-green-500 text-green-500 font-bold text-2xl px-3 py-1 rounded-lg rotate-[-20deg] z-20">
          感兴趣 ❤️
        </div>
      )}
      {isTop && direction === 'left' && (
        <div className="absolute top-6 right-6 border-4 border-red-400 text-red-400 font-bold text-2xl px-3 py-1 rounded-lg rotate-[20deg] z-20">
          跳过 ✖
        </div>
      )}

      {/* 卡片内容（由父组件通过 render prop 或 children 传入） */}
      {card.content}
    </div>
  );
};
```

---

## 卡片堆叠容器

```jsx
// src/components/SwipeDeck.jsx
export const SwipeDeck = ({ cards, onSwipeLeft, onSwipeRight, renderCard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeRight = (card) => {
    onSwipeRight(card);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeLeft = (card) => {
    onSwipeLeft(card);
    setCurrentIndex(prev => prev + 1);
  };

  // 显示当前及后两张
  const visibleCards = cards.slice(currentIndex, currentIndex + 3);

  if (visibleCards.length === 0) {
    return <EmptyDeck />; // 结束页
  }

  return (
    <div className="relative flex items-center justify-center" style={{ height: 520 }}>
      {visibleCards.map((card, i) => (
        <SwipeCard
          key={card.id}
          card={card}
          isTop={i === 0}
          stackIndex={i}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        >
          {renderCard(card, i === 0)}
        </SwipeCard>
      ))}
    </div>
  );
};
```

---

## 社团卡片内容

```jsx
// 社团卡片内容模板（传给 SwipeCard 的内容）
const ClubCardContent = ({ club, matchData, onDetail }) => (
  <div className="h-[480px] flex flex-col">
    {/* 封面区域 */}
    <div
      className="h-48 flex items-center justify-center relative flex-shrink-0"
      style={{ backgroundColor: club.coverColor }}
    >
      <span className="text-7xl">{club.avatar}</span>
      {/* 匹配分数圆环 */}
      {matchData && (
        <div className="absolute top-3 right-3">
          <MatchScoreRing score={matchData.matchScore} size={56} />
        </div>
      )}
      {/* 社团名称覆盖在封面底部 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <h3 className="text-white font-bold text-lg">{club.name}</h3>
        <span className="text-white/80 text-xs">{club.category}</span>
      </div>
    </div>

    {/* 内容区域 */}
    <div className="flex-1 p-4 flex flex-col gap-3">
      {/* AI 推荐理由 */}
      {matchData && (
        <p className="text-gray-600 text-sm leading-relaxed">{matchData.reason}</p>
      )}

      {/* 匹配点标签 */}
      {matchData?.highlights && (
        <div className="flex flex-wrap gap-1.5">
          {matchData.highlights.map((h, i) => (
            <span key={i} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">
              ✓ {h}
            </span>
          ))}
        </div>
      )}

      {/* 基本信息 */}
      <div className="flex gap-3 text-xs text-gray-500 mt-auto">
        <span>👥 {club.memberCount}人</span>
        <span>⏰ 每周约{club.weeklyHours}小时</span>
      </div>

      {/* 查看详情 */}
      <button
        onClick={(e) => { e.stopPropagation(); onDetail(club); }}
        className="text-indigo-500 text-sm text-center hover:underline"
      >
        查看详情 →
      </button>
    </div>
  </div>
);
```

---

## 底部操作按钮

```jsx
// 底部左右滑动按钮
const SwipeButtons = ({ onLeft, onRight }) => (
  <div className="flex gap-8 justify-center mt-6">
    <button
      onClick={onLeft}
      className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-200 text-2xl hover:scale-110 transition-transform flex items-center justify-center"
    >
      ✖
    </button>
    <button
      onClick={onRight}
      className="w-14 h-14 rounded-full bg-indigo-500 shadow-md text-2xl hover:scale-110 transition-transform flex items-center justify-center text-white"
    >
      ❤️
    </button>
  </div>
);
```

---

## 结束页

```jsx
const EmptyDeck = ({ onViewAll, onViewApplications }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="text-6xl mb-2">🎉</div>
    <h3 className="text-xl font-semibold text-gray-800">已浏览全部 AI 推荐社团</h3>
    <p className="text-gray-500 text-sm">还想探索更多？</p>
    <div className="flex flex-col gap-3 w-full max-w-xs">
      <button
        onClick={onViewAll}
        className="bg-indigo-500 text-white py-3 rounded-xl font-medium hover:bg-indigo-600 transition-colors"
      >
        查看更多社团
      </button>
      <button
        onClick={onViewApplications}
        className="border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
      >
        查看我的申请
      </button>
    </div>
  </div>
);
```

---

## MatchScoreRing 组件

```jsx
export const MatchScoreRing = ({ score, size = 80 }) => {
  const strokeWidth = size > 60 ? 6 : 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: size * 0.24, fontWeight: 700, color }}>{score}</span>
      </div>
    </div>
  );
};
```
