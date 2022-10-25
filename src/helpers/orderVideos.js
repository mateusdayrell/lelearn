export const orderVideos = array => {
  return array.sort((a, b) => a.cursos_videos.ordem > b.cursos_videos.ordem ? 1 : -1)
}
