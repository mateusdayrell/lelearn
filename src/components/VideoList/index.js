import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { ArrowUp, ArrowDown } from 'phosphor-react';
import { toast } from 'react-toastify';

export default function VideoList({videos, handleOrder}) {
  const [show, setShow] = useState('')
  const [order, setOrder] = useState('')

  const handleClear = () => {
    setShow('')
    setOrder('')
  }

  const handleShow = (index) => {
    setShow(index)
    setOrder(index+1)
  }

  const orderUp = (i) => {
    const array = [...videos]

    if (!array[i - 1]) return

    array.splice(i-1, 2, array[i], array[i-1])

    handleOrder(array)
    handleClear()
  }

  const orderDown = (i) => {
    const array = [...videos]

    if (!array[i + 1]) return

    array.splice(i, 2, array[i+1], array[i])

    handleOrder(array)
    handleClear()
  }

  const orderInput = (i) => {
    const array = [...videos]

    if (!order || order === '0' || order === i) {
      handleClear()
    }
    if (order > (array.length + 1)) {
      toast.error('erro!');
    }
    const [element] = array.splice(i, 1)
    array.splice(order-1, 0, element)

    handleOrder(array)
    handleClear()
  }

  return (
    <>
      {videos.map((video, index) => (
        <div
          key={video.cod_video}
          className="text-white border my-2 p-2 rounded flex items-center gap-2"
        >
          <span className='flex w-24'>
            {show === index ?
              <>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
                <span className='flex'>
                  <button type='button' onClick={() => orderInput(index)}>Alterar</button>
                </span>
              </>
            :
              <>
                <input
                  type="number"
                  onFocus={() => handleShow(index)}
                  onBlur={() => handleClear()}
                  value={index+1}
                  onChange={(e) => setOrder(e.target.value)}
                />
                <span className='flex'>
                  <button type='button' onClick={() => orderUp(index)}>
                    <ArrowUp size={22} weight="bold" />
                  </button>
                  <button type='button' onClick={() => orderDown(index)}>
                    <ArrowDown size={22} weight="bold" />
                  </button>
                </span>
              </>
            }
          </span>
          <span className='flex-1'>{video.titulo_video} {video.cursos_videos.ordem}</span>
        </div>
      ))}
    </>
  );
}

VideoList.defaultProps = {
  videos: [],
  handleOrder: () => null,
};

VideoList.propTypes = {
  videos: PropTypes.array,
  handleOrder: PropTypes.func,
};
