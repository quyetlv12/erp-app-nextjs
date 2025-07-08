import React from 'react'
interface TitleProps {
    title : string;
}
const Title = ({title = ''} : TitleProps ) => {
    return (
        <h1 className='text-[24px] font-bold text-dard'>{title}</h1>
    )
}

export default Title