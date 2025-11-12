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
    if (inputValue.trim()) {
      const newItem: WheelItem = {
        id: Date.now().toString(),
        value: inputValue.trim(),
        color: colors[items.length % colors.length]
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
      const adjustedRotation = (360 - normalizedRotation + segmentAngle / 2) % 360;
      const selectedIndex = Math.floor(adjustedRotation / segmentAngle);
      const selected = items[selectedIndex];
      
      setSelectedItem(selected.value);
      setIsSpinning(false);
    }, spinDuration);
  };

  const createWheelSegments = () => {
    return items.map((item, index) => {
      const angle = (360 / items.length);
      const rotation = angle * index;
      const skewAngle = 90 - angle;
      
      return (
        <div
          key={item.id}
          className="absolute w-1/2 h-1/2 origin-bottom-right"
          style={{
            transform: `rotate(${rotation}deg) skewY(${skewAngle}deg)`,
            backgroundColor: item.color,
          }}
        >
          <div 
            className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm"
            style={{
              transform: `skewY(-${skewAngle}deg) rotate(${angle / 2}deg)`,
              paddingLeft: '20%',
            }}
          >
            <span className="transform rotate-90 origin-center">
              {item.value.length > 15 ? item.value.substring(0, 15) + '...' : item.value}
            </span>
          </div>
        </div>
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
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-red-600"></div>
              </div>
              
              {/* Wheel */}
              <div 
                ref={wheelRef}
                className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-gray-800 transition-transform duration-3000 ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionDuration: isSpinning ? '3000ms' : '0ms',
                }}
              >
                {items.length > 0 ? createWheelSegments() : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500 text-center px-8">
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
                  placeholder="Enter an item (e.g., Movie: Avatar)"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addItem}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
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
                    const newItems = movieItems.map((movie, index) => ({
                      id: Date.now().toString() + index,
                      value: movie,
                      color: colors[index % colors.length]
                    }));
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
