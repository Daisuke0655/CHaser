import postMatchLog from "../../components/postMatchLog";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Match.css";
import fieldDraw from "../../components/fieldDraw";
import FieldDrawByJsx from "../../components/fieldDrawByJsx";

const Match = () => {
  const height = 17;
  const width = 15;
  const lineWidth = 2;
  const blockSize = 20;

  const dir = {
    u: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
    l: { x: 0, y: -1 },
    r: { x: 0, y: 1 },
  };

  const [turnNum, setTurnNum] = useState(0);
  const [matchLog, setMatchLog] = useState(null);
  const [fields, setFields] = useState([]);
  const { jsonData } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const log = JSON.parse(jsonData);
        setMatchLog(log);
      } catch (error) {
        console.error("JSONパース中にエラー発生:", error);
      }
    };
    if (jsonData) {
      fetchData();
    }
  }, [jsonData]);

  useEffect(() => {
    if (matchLog) {
      const newFields = [];
      let coldPos = { x: 0, y: 0 },
        hotPos = { x: 0, y: 0 };

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (matchLog.Field[i][j] === "C") {
            coldPos.x = i;
            coldPos.y = j;
          }
          if (matchLog.Field[i][j] === "H") {
            hotPos.x = i;
            hotPos.y = j;
          }
        }
      }

      let currentField = [];
      if (matchLog && matchLog.Field) {
        matchLog.Field.forEach((row) => {
          currentField.push(row.split(""));
        });
      }
      newFields.push(structuredClone(currentField));

      matchLog.log.forEach((act) => {
        if (!act[1] || !dir[act[1]]) {
          console.error("Invalid action or direction:", act);
          return; // 無効なアクションの場合はスキップ
        }
        const turn = newFields.length;
        let px, py;
        if (turn % 2) {
          // Cold
          px = coldPos.x + dir[act[1]].x;
          py = coldPos.y + dir[act[1]].y;
        } else {
          // Hot
          px = hotPos.x + dir[act[1]].x;
          py = hotPos.y + dir[act[1]].y;
        }
        if (px < 0 || px >= height || py < 0 || py >= width) {
          console.error("Position out of bounds:", { px, py });
          return; // 無効な位置の場合はスキップ
        }
        if (act[0] === "p") {
          currentField[px][py] = "2";
        } else if (act[0] === "w") {
          if (turn % 2) {
            if (currentField[px][py] === "3")
              currentField[coldPos.x][coldPos.y] = "2";
            else currentField[coldPos.x][coldPos.y] = "0";
            coldPos.x = px;
            coldPos.y = py;
            currentField[coldPos.x][coldPos.y] = "C";
          } else {
            if (currentField[px][py] === "3")
              currentField[hotPos.x][hotPos.y] = "2";
            else currentField[hotPos.x][hotPos.y] = "0";
            hotPos.x = px;
            hotPos.y = py;
            currentField[hotPos.x][hotPos.y] = "H";
          }
        }
        newFields.push(structuredClone(currentField));
      });
      console.log(structuredClone(newFields));
      setFields(structuredClone(newFields));
    }
  }, [matchLog]);

  const previousTurn = () => {
    if (turnNum > 0) setTurnNum(turnNum - 1);
  };

  const nextTurn = () => {
    if (turnNum < fields.length - 1) setTurnNum(turnNum + 1);
  };

  if (!matchLog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="heading">試合結果</h1>
      <button
        onClick={previousTurn}
        className={`button ${turnNum <= 0 ? "button-disable" : ""}`}
      >
        前ターン
      </button>
      <button onClick={nextTurn} className="button">
        次ターン
      </button>
      <div>{turnNum + 1}ターン目</div>

      <div className="field-container">
        <FieldDrawByJsx
          fields={fields}
          turnNum={turnNum}
          height={height}
          width={width}
        />
      </div>
    </div>
  );
};

export default Match;
