import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { AuthContext } from '../../contexts'
import {
  randAlert,
  getRoomPrivacy,
  getRoom,
  getComment,
  getLike,
  postLike,
  postComment,
  deleteLike
} from '../../helpers'
import './Room.scss'

import { FaHeart, FaFileDownload, FaSignOutAlt, FaWalking, FaHeartBroken } from 'react-icons/fa'
import { Comment, Playlist, Button, Popup } from '../../components'

export default () => {
  const history = useHistory()
  const { room_id } = useParams()
  const [auth] = useContext(AuthContext)
  const [popup, setPopup] = useState('')
  const [password, setPassword] = useState('')
  const [roomData, setRoomData] = useState({
    name: 'Loading',
    subject: 'Loading',
    teacher_name: 'Loading',
    resources: [{ topic: 'Loading', link: '' }],
    private: false
  })
  const [playlist, setPlaylist] = useState({ show: false, playing: 0, id: 0 })
  const [comments, setComments] = useState([])
  const [like, setLike] = useState({ liked: false, count: 0 })

  useEffect(() => {
    setPopup('loading')

    getRoomPrivacy(room_id)
      .then(res => {
        const { lock, error } = res.data
        if (lock) {
          setPopup('password')
        } else if (!lock) {

          getRoom(room_id)
            .then(res => {
              const { room, error } = res.data
              if (room) {
                setRoomData(room)
                getRemainingData(room)
              } else {
                setPopup({ type: 'alert', title: randAlert(), text: error })
              }
            })
        } else {
          setPopup({ type: 'alert', title: randAlert(), text: error })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRemainingData = room => {
    getComment(room, playlist)
      .then(res => {
        const { comments, error } = res.data
        if (comments) {
          setComments(comments)

          getLike(room_id, auth.data)
            .then(res => {
              const { liked, error } = res.data
              if (error) {
                setPopup({ type: 'alert', title: randAlert(), text: error })
              } else {
                setLike({ liked, count: room.likes.length })
                setPopup('')
              }
            })
        } else {
          setPopup({ type: 'alert', title: randAlert(), text: error })
        }
      })
  }

  const handlePrivacy = e => {
    e.preventDefault()
    setPopup('loading')

    getRoom(room_id, password)
      .then(res => {
        const { room, error } = res.data
        if (room) {
          setRoomData(room)
          getRemainingData(room)
        } else {
          setPopup({ type: 're-password', title: randAlert(), text: error })
        }
      })
  }
  const handlePassword = value => setPassword(value)
  const handlePlaylist = (value, action) => {
    const newValue = value
    setPlaylist(newValue)
    if (action) {
      setPopup('loading')

      getComment(roomData, newValue)
        .then(res => {
          const { comments, error } = res.data
          if (comments) {
            setComments(comments)
            setPopup('')
          } else {
            setPopup({ type: 'alert', title: randAlert(), text: error })
          }
        })
    }
  }
  const exitRoom = () => setPopup({ type: 'confirm', func: () => { window.location = '/home' } })
  const downloadFile = () => {
    const file = roomData.resources[playlist.playing].file_url
    if (file) window.open(file)
    else setPopup({ type: 'alert', title: randAlert(), text: 'This video has no file to download' })
  }
  const likeVideo = () => {
    if (like.liked) {
      setLike({ liked: false, count: like.count - 1 })

      deleteLike(room_id, auth.data)
        .then(res => {
          const { success, error } = res.data
          if (success) {
            console.log('Unliked!')
          } else {
            setPopup({ type: 'alert', title: randAlert(), text: error })
            setLike({ liked: true, count: like.count + 1 })
          }
        })
    } else {
      setLike({ liked: true, count: like.count + 1 })

      postLike(room_id, auth.data)
        .then(res => {
          const { success, error } = res.data
          if (success) {
            console.log('Liked!')
          } else {
            setPopup({ type: 'alert', title: randAlert(), text: error })
            setLike({ liked: false, count: like.count - 1 })
          }
        })
    }
  }
  const writeComment = text => {
    postComment(auth.data, roomData, playlist, text)
      .then(res => {
        const { user, error } = res.data
        if (user) {
          getRemainingData(roomData)
        } else {
          setPopup({ type: 'alert', title: randAlert(), text: error })
        }
      })
  }

  return (
    <div className="full-page">
      <div className="full-page-content room-content">

        <section id="video-container">
          {<iframe
            id="embed-video"
            src={roomData.resources[playlist.playing].video_url}
            title={roomData.resources[playlist.playing].topic}
            allowFullScreen
          ></iframe>}

          <footer id="video-footer">
            <div id="video-title">
              <h6 style={bold}>{roomData.resources[playlist.playing].topic}</h6>
              <p id="video-teacher" onClick={() => history.push(`/profile/${roomData.teacher_id}`)}>
                by {roomData.teacher_id === auth.data.user_id ? 'You' : roomData.teacher_name}
              </p>
            </div>
            <div id="video-btn-group">
              <div className={`room-btn ${like.liked && 'active'}`} onClick={likeVideo}>
                <FaHeart className={`room-btn-icon ${like.liked && 'active'}`} />
              </div>
              <div className="room-btn" onClick={downloadFile}>
                <FaFileDownload className="room-btn-icon" />
              </div>
              <div className="room-btn" onClick={exitRoom}>
                <FaSignOutAlt className="room-btn-icon" />
              </div>
            </div>
          </footer>
        </section>

        <div id="room-panel">
          <section id="room-course-card">
            <header>
              <h5 style={bold}>{roomData.name}</h5>
              <p id="room-course-count">{roomData.resources.length} video{roomData.resources.length > 1 ? 's' : null}</p>
            </header>
            <footer id="room-course-footer">
              <div style={alignHeart}>
                <FaHeart style={heart} /> {like.count}
              </div>
              <Button color="" text="show all" onClick={() => setPlaylist({ ...playlist, show: !playlist.show })} />
            </footer>
            <Playlist
              playlist={playlist}
              setPlaylist={handlePlaylist}
              roomData={roomData}
            />
          </section>

          <div id="comment-container">
            <Comment
              post={writeComment}
              comments={comments}
            />
          </div>

        </div>
      </div>

      {popup === 'loading' && <Popup type="loading" text="Loading" />}
      {popup === 'password' &&
        <Popup
          type="password"
          title="It's Locked!"
          text="This course require a password"
          onChange={handlePassword}
          onConfirm={handlePrivacy}
          onCancel={() => history.push('/home')}
        />}
      {popup.type === 'confirm' &&
        <Popup
          type="confirm"
          Icon={FaWalking}
          title="Exiting.."
          text="Are you sure, You want to exit"
          confirm="Yes"
          cancel="No"
          onConfirm={popup.func}
          onCancel={() => setPopup('')}
        />}
      {popup.type === 'alert' &&
        <Popup
          type="alert"
          Icon={FaHeartBroken}
          title={popup.title}
          text={popup.text}
          confirm="Okay"
          onConfirm={() => setPopup('')}
        />}
      {popup.type === 're-password' &&
        <Popup
          type="alert"
          Icon={FaHeartBroken}
          title={popup.title}
          text={popup.text}
          confirm="Try again"
          onConfirm={() => setPopup('password')}
        />}
    </div >
  );
}

const bold = {
  fontWeight: '500'
}

const heart = {
  fontSize: '20px',
  color: '#ff0062',
  marginRight: '10px'
}

const alignHeart = {
  display: 'flex',
  alignItems: 'center'
}