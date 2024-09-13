import React, { useMemo } from "react";
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
  const data = useMemo(() => chunkArray(items, rowSize ?? 2), [items.length]);

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
          {chunk.map(renderItem)}
        </View>
      ))}
    </View>
  );
}

export default Grid;
