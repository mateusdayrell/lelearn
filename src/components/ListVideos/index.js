import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowCircleUp, ArrowCircleDown, MinusCircle } from 'phosphor-react';
import { toast } from 'react-toastify';
import './style.css';

export default function ListVideos({ videos, setVideos, handleRemove, deleted }) {
  const [show, setShow] = useState('')
  const [order, setOrder] = useState('')

  const handleClear = () => {
    setShow('')
    setOrder('')
  }

  const handleShow = (index) => {
    setShow(index)
    setOrder(index + 1)
  }

  const orderUp = (i) => {
    const array = [...videos]

    if (!array[i - 1]) return

    array.splice(i - 1, 2, array[i], array[i - 1])

    setVideos(array)
    handleClear()
  }

  const orderDown = (i) => {
    const array = [...videos]

    if (!array[i + 1]) return

    array.splice(i, 2, array[i + 1], array[i])

    setVideos(array)
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
    array.splice(order - 1, 0, element)

    setVideos(array)
    handleClear()
  }

  return (
    videos.length > 0 && videos.map((video, index) => (
      <div key={video.cod_video} className='ContentListVideo'>
        {!deleted &&
          <span className='InfoListVideoSpan'>
            {show === index ?
              <>
                <input type="number" value={order} onChange={(e) => setOrder(e.target.value)}/>
                <span>
                  <button type='button' onClick={() => orderInput(index)} className='AlterBtnListVideo'>Alterar</button>
                </span>
              </>
              :
              <>
                <input type="number" onFocus={() => handleShow(index)} onBlur={() => handleClear()} value={index + 1} onChange={(e) => setOrder(e.target.value)}/>
                  <span>
                    <button type='button' onClick={() => orderUp(index)} className="ArrowBtn">
                      <ArrowCircleUp size={22} weight='bold'/>
                    </button>
                    <button type='button' onClick={() => orderDown(index)} className="ArrowBtn">
                      <ArrowCircleDown size={22} weight='bold'/>
                    </button>
                  </span>
              </>
            }
          </span>
        }

        <span>
          {deleted && `${index  } - `}
          {video.titulo_video}
        </span>

        {!deleted &&
          <button type='button' onClick={() => handleRemove(index)} className="RemoveBtnListVideo" title='Remover'>
            <MinusCircle size={22}/>
          </button>
        }
      </div>
    ))
  );
}

ListVideos.defaultProps = {
  videos: [],
  setVideos: () => null,
  handleRemove: () => null,
  deleted: false,
};

ListVideos.propTypes = {
  videos: PropTypes.array,
  setVideos: PropTypes.func,
  handleRemove: PropTypes.func,
  deleted: PropTypes.bool,
};
