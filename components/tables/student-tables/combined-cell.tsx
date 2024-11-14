import React from 'react';

type CombinedCellProps<T> = {
  data: T | T[]; 
  fields?: Array<keyof T> | string[]; 
};

export const CombinedCell = <T,>({ data, fields }: CombinedCellProps<T>) => {
  const dataArray = Array.isArray(data) ? data : [data];

  return (
    <div>
      {dataArray.map((item, index) => (
        <div key={index} style={{ marginBottom: '8px' }}>
          {Array.isArray(fields) ? (
            fields.map((field, subIndex) => (
              //@ts-ignore
              <div key={subIndex}>{String(item[field])}</div>
            ))
          ) : (
            <div>{String(item)}</div>
          )}
        </div>
      ))}
    </div>
  );
};
