"use client"
import { useEffect, useState } from 'react'

export default function Home() {

  const [latest, setLatest] = useState([]);
  const [matchs, setMatchs] = useState([]);
  const [level, setLevel] = useState(33);
  const [isSystem, setIsSystem] = useState(true);
  const [winner, setWinner] = useState(null);

  const set = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [0, 4, 8],
    [2, 4, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];

  useEffect(() => {
    set.forEach(subset => {
      if (subset.every(item => latest.some(obj => obj.item === item && obj.value === "X"))) {
        setMatchs(subset);
      }
      if (subset.every(item => latest.some(obj => obj.item === item && obj.value === "O"))) {
        setMatchs(subset);
      }
      if (matchs.length) {
        if (latest[subset[0]].value === 'X') {
          setWinner(1);
        } else {
          setWinner(2);
        }
      }
    });
  }, [latest])


  console.log(winner === 1 && 'Player 1', winner === 2 && 'Player 2');

  const handleClick = (idx) => {
    // set.map(setItem => {
    //   latest.map(i => {
    //     setItem.map(id => {
    //       if (id === i.item) {
    //         console.log(i);
    //       }
    //     })
    //   })
    // })
    if (!latest.filter(item => item.item === idx).length) {
      setLatest(prevLatest => {
        const newLatest = [...prevLatest, { item: idx, value: prevLatest[prevLatest.length - 1]?.value === 'X' ? 'O' : 'X' }];
        return newLatest;
      });

      if (isSystem && latest.length < 8) {
        setLatest(prevLatest => {
          const remainingValues = [];
          for (let i = 0; i < 9; i++) {
            if (!prevLatest.some(item => item.item === i)) {
              remainingValues.push(i);
            }
          }

          const randomIndex = Math.floor(Math.random() * remainingValues.length);
          const randomValue = remainingValues[randomIndex];

          const newLatest = [...prevLatest, { item: randomValue, value: prevLatest[prevLatest.length - 1]?.value === 'X' ? 'O' : 'X' }];
          return newLatest;
        });
      }
    }
  }

  console.log({ latest });


  function includesArray(arr, matchs) {
    console.log({ arr, matchs });
    return arr.some(subArr =>
      subArr.length === matchs?.length && subArr.every((value, index) => value === matchs[index])
    );
  };


  const findWinnerItems = (arr) => {
    if (!matchs.length || !arr) return false;
    // console.log(matchs === arr);
    // arr.map(i => {
    //   if (matchs.length && !matchs.includes(i)) {
    //     return false;
    //   }
    // });
    // return true;

    return Array.isArray(matchs) &&
      Array.isArray(arr) &&
      matchs.length === arr.length &&
      matchs.every((val, index) => val === arr[index]);

  }

  // console.log(includesArray(matchs, [2, 4]));

  const handleLevel = (e) => {
    setLevel(e.target.value);
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>
        <div>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h5 className="text-4xl font-bold"> Player 1: X</h5>
              <h5 className="text-4xl font-bold"> Player 2: O</h5>
            </div>
            <h5 className="text-4xl font-bold">Mode: {isSystem ? "System" : "Player"}</h5>
          </div>

          <label htmlFor="steps-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Level</label>
          <input id="steps-range" type="range" min="0" max="99" step="33" onChange={handleLevel} value={level} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
          <div className="text-center mb-6 mt-4">
            <h5 className={`text-4xl font-bold ${level == 33 ? 'text-yellow-300' : level == 66 ? 'text-orange-500' : level == 99 && 'text-red-700'}`}>{level == 0 ? 'Easy' : level == 33 ? 'Normal' : level == 66 ? 'Medium' : 'Harder'}</h5>
          </div>

        </div>
        <div className="grid grid-cols-3 grid-rows-3 gap-[2px]">
          {matchs.length > 0 &&
            <svg height="65vh" width="65vh" className={`absolute line z-20 ${findWinnerItems([2, 4, 6]) ? 'dig-rig' : findWinnerItems([0, 4, 8]) ? 'dig-lef' : findWinnerItems([0, 1, 2]) ? 'top' : findWinnerItems([3, 4, 5]) ? 'v-bot' : findWinnerItems([6, 7, 8]) ? 'bot' : findWinnerItems([4, 1, 7]) ? 'h-cen' : findWinnerItems([0, 3, 6]) ? 'lef' : findWinnerItems([2, 5, 8]) ? 'rig' : findWinnerItems([1, 4, 7]) && 'h-cen'}`}>
              <line x1="0" y1="0" x2="65vh" y2="65vh" style={{ stroke: "rgb(79 70 229 / var(--tw-bg-opacity))", strokeWidth: 2 }} />
            </svg>
          }
          {Array.from({ length: 9 }, (j, i) => {
            return <div
              key={i}
              className={`${latest.filter(item => item.item === i).length && "active"} ${matchs?.includes(i) && 'winner'} item w-[20vh] h-[20vh] bg-gray-800 p-4 flex active:scale-95 items-center justify-center cursor-pointer hover:scale-105 transition-all hover:bg-gray-600`}
              onClick={() => { winner === null ? handleClick(i) : '' }}
            >
              <h5 className="text-4xl font-bold">{latest.filter(item => item.item === i)[0]?.value}</h5>
            </div>
          })}
        </div>
        <div className="flex justify-between items-center mt-8">
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            type="checkbox"
            role="switch" onChange={(e) => setIsSystem(e.target.checked)} checked={isSystem} />

          <button className="bg-indigo-700 px-12 py-4 hover:bg-indigo-600 hover:scale-105 transition-all active:scale-95" onClick={() => { setWinner(null); setLatest([]); setMatchs([]) }}>Reset</button>

        </div>
      </div>
    </main>
  )
}
