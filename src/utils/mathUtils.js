export const degs2rads = (degs) => {
  return 2*3.14159265*(degs/360)
}

export const verticalFov2horizontalRads = (verticalFovDegrees) => {
  const aspect = window.innerWidth/window.innerHeight
  return Math.atan( Math.tan( degs2rads(verticalFovDegrees) )*aspect )
}