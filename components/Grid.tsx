import React from "react";
import { View } from "react-native";

function chunkArray<T>(array: T[], chunkSize: number) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
}

interface GridProps<T> {
  items: T[];
  renderItem: (item: T, index: number, array: T[]) => React.ReactNode;
  rowSize?: number;
  rowGap?: number;
}

function Grid<T>({ items, renderItem, rowSize, rowGap }: GridProps<T>) {
  const data = chunkArray(items, rowSize ?? 2);

  return (
    <View>
      {data.map((chunk, index) => (
        <View
          key={index}
          style={{
            marginBottom: rowGap,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {chunk.map((item, index, arr) => (
            <React.Fragment key={index}>
              {renderItem(item, index, arr)}
            </React.Fragment>
          ))}
        </View>
      ))}
    </View>
  );
}

export default Grid;
