'use client';

import { useState, useRef } from 'react';

interface WheelItem {
  id: string;
  value: string;
  color: string;
}

export default function Home() {
  const [items, setItems] = useState<WheelItem[]>([
    { id: '1', value: 'Movie: Inception', color: '#FF6B6B' },
    { id: '2', value: 'Movie: The Matrix', color: '#4ECDC4' },
    { id: '3', value: 'Movie: Interstellar', color: '#45B7D1' },
    { id: '4', value: 'Movie: The Dark Knight', color: '#96CEB4' },
    { id: '5', value: 'Movie: Pulp Fiction', color: '#FFEAA7' },
    { id: '6', value: 'Movie: The Shawshank Redemption', color: '#DDA0DD' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FF8CC8', '#A8E6CF', '#FFD3B6', '#FFAAA5', '#FF8B94', '#A8DADC'
  ];

  const addItem = () => {
    if (items.length >= 12) {
      alert('Maximum of 12 items allowed!');
      return;
    }
    if (inputValue.trim()) {
      // Get the color of the last item to avoid duplicates
      const lastColor = items.length > 0 ? items[items.length - 1].color : null;
      let newColor = colors[items.length % colors.length];
      
      // If the new color matches the last color, use the next one
      if (newColor === lastColor && colors.length > 1) {
        newColor = colors[(items.length + 1) % colors.length];
      }
      
      const newItem: WheelItem = {
        id: Date.now().toString(),
        value: inputValue.trim(),
        color: newColor
      };
      setItems([...items, newItem]);
      setInputValue('');
      setSelectedItem(null);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
  };

  const spinWheel = () => {
    if (items.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedItem(null);

    const spinDuration = 3000 + Math.random() * 2000;
    const spinRotations = 5 + Math.random() * 5;
    const finalRotation = rotation + (spinRotations * 360) + Math.random() * 360;
    
    setRotation(finalRotation);

    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const segmentAngle = 360 / items.length;
      // Pointer is at top (270 degrees in our coordinate system where 0 is right)
      // Find which segment is under the pointer
      const pointerPosition = 270; // Top of wheel
      const totalRotation = (pointerPosition - normalizedRotation + 360) % 360;
      const selectedIndex = Math.floor(totalRotation / segmentAngle) % items.length;
      const selected = items[selectedIndex];
      
      setSelectedItem(selected.value);
      setIsSpinning(false);
    }, spinDuration);
  };

  const createWheelSegments = () => {
    const segmentAngle = 360 / items.length;
    
    return items.map((item, index) => {
      // Start at 0 degrees (right side) and go clockwise
      const startAngle = (index * segmentAngle) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle) * (Math.PI / 180);
      const midAngle = (startAngle + endAngle) / 2;
      
      // Create SVG path for perfect pie slice
      const radius = 160; // Half of wheel size (320px / 2)
      const centerX = 160;
      const centerY = 160;
      
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      
      const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // Text positioning along the radius
      const textRadius = radius * 0.65;
      const textX = centerX + textRadius * Math.cos(midAngle);
      const textY = centerY + textRadius * Math.sin(midAngle);
      const textRotation = (midAngle * 180 / Math.PI) + 90;
      
      // Split text into multiple lines if too long
      const maxCharsPerLine = 12;
      const words = item.value.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length <= maxCharsPerLine) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);
      
      // Limit to 2 lines
      if (lines.length > 2) {
        lines[1] = lines[1].substring(0, maxCharsPerLine - 3) + '...';
        lines.splice(2);
      }
      
      return (
        <g key={item.id}>
          <path
            d={pathData}
            fill={item.color}
            stroke="none"
          />
          <text
            x={textX}
            y={textY}
            fill="white"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
            style={{
              pointerEvents: 'none',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {lines.map((line, i) => (
              <tspan
                key={i}
                x={textX}
                dy={i === 0 ? `-${(lines.length - 1) * 0.5}em` : '1em'}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Spinning Wheel Picker
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wheel Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 mb-8">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-20">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600"></div>
              </div>
              
              {/* Wheel */}
              <div 
                ref={wheelRef}
                className="relative w-full h-full rounded-full shadow-2xl border-8 border-gray-800 transition-transform duration-3000 ease-out overflow-hidden"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isSpinning ? '3000ms' : '0ms',
                  backgroundColor: items.length === 0 ? '#e5e7eb' : 'transparent'
                }}
              >
                {items.length > 0 ? (
                  <svg width="100%" height="100%" viewBox="0 0 320 320" className="absolute inset-0" style={{ backgroundColor: items.length === 1 ? items[0].color : 'transparent' }}>
                    {createWheelSegments()}
                  </svg>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0 rounded-full">
                    <p className="text-gray-500 text-center px-8 -mt-35">
                      Add items to the wheel to get started!
                    </p>
                  </div>
                )}
              </div>
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-800 rounded-full border-4 border-white shadow-lg z-10"></div>
            </div>
            
            <button
              onClick={spinWheel}
              disabled={items.length === 0 || isSpinning}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
            </button>
            
            {selectedItem && (
              <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                <p className="text-center font-bold text-green-800">
                  🎉 Selected: {selectedItem}
                </p>
              </div>
            )}
          </div>
          
          {/* Controls Section */}
          <div className="space-y-6">
            {/* Add Item */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Add Item</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  placeholder={`Enter an item (${items.length}/12)`}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addItem}
                  disabled={items.length >= 12}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Items List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Items ({items.length})
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No items added yet. Add some items to start spinning!
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-800">{item.value}</span>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const movieItems = [
                      'Movie: The Godfather',
                      'Movie: Forrest Gump',
                      'Movie: The Lion King',
                      'Movie: Jurassic Park',
                      'Movie: Titanic',
                      'Movie: Avatar',
                      'Movie: The Avengers',
                      'Movie: Frozen'
                    ];
                    const newItems = movieItems.map((movie, index) => {
                      // Ensure no adjacent colors are the same
                      let colorIndex = index % colors.length;
                      if (index > 0 && colors[colorIndex] === colors[(index - 1) % colors.length]) {
                        colorIndex = (colorIndex + 1) % colors.length;
                      }
                      return {
                        id: Date.now().toString() + index,
                        value: movie,
                        color: colors[colorIndex]
                      };
                    });
                    setItems(newItems);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Load Movies
                </button>
                <button
                  onClick={() => {
                    setItems([]);
                    setSelectedItem(null);
                    setRotation(0);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}