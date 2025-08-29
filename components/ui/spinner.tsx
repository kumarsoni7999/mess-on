// Spinner.tsx
import React from 'react';

const Spinner = ({ size }: any) => {
    return <div className='flex justify-center items-center'>
        <div className="spinner" style={{
            width: size || 20,
            height: size || 20
        }}></div>
    </div>
};

export default Spinner;
