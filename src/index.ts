function normalizeRad(angle: number): number {
  const draft = angle % (Math.PI * 2)
  return draft < Math.PI * 2 ? draft + Math.PI * 2 : draft
}
/** Gives the ▲-angle between from and to angles (shortest path), use radians.
 *
 * Sign of the returned angle denotes direction, positive means counterClockwise 🔄
 * @example```deltaAngle({fromAngle: Math.PI/8, toAngle: Math.PI/4})```
 * gives ```Math.PI/8```
 */
function deltaAngle({
  fromAngle,
  toAngle,
}: {
  fromAngle: number
  toAngle: number
}): number {
  const normFromAngle = normalizeRad(fromAngle)
  const normToAngle = normalizeRad(toAngle)
  const provisional = normToAngle - normFromAngle
  if (provisional > -Math.PI && provisional <= Math.PI) return provisional

  if (provisional > Math.PI) return provisional - Math.PI * 2
  if (provisional < -Math.PI) return provisional + Math.PI * 2
  return 0
}

/**
 * @example ```distanceBetweenPoints([0,0], [0,5])```
 * gives `5`
 * @example ```distanceBetweenPoints([0,0], [3,4])```
 * gives `5`
 */
function distanceBetweenPoints(pointA: Point, pointB: Point): number {
  return Math.sqrt(
    Math.pow(pointB[1] - pointA[1], 2) + Math.pow(pointB[0] - pointA[0], 2)
  )
}

export interface Coordinate {
  x: number
  y: number
}

type ArcType = 'shortest' | 'longest' | 'clockwise' | 'counterCW'

function isClockwise({
  fromAngle,
  toAngle,
  arcType,
  obtuse,
}: {
  fromAngle: number
  toAngle: number
  arcType: ArcType
  obtuse: boolean
}) {
  if (['clockwise', 'counterCW'].includes(arcType)) {
    return arcType === 'clockwise'
  }
  const isDeltaPositive = deltaAngle({ fromAngle, toAngle }) > 0
  if (isDeltaPositive) {
    // if the angle delta is positive and the arcType is 'longest' than the clockwise will give the obtuse tangent (and CCW the acute)
    return arcType === 'longest' ? obtuse : !obtuse
  }
  // if the angle delta is negative and the arcType is 'shortest' than the clockwise will give the obtuse tangent (and CCW the acute)
  return arcType === 'shortest' ? obtuse : !obtuse
}

export function calculate3PointsForTangentialArc(
  radius: number,
  angle: number,
  arcStartPoint: Coordinate,
  previousPoint: Coordinate,
  { arcType = 'shortest', obtuse = true }: { arcType: ArcType; obtuse: boolean }
): {
  circleCenter: Coordinate
  startPoint: Coordinate
  onArc: Coordinate
  endPoint: Coordinate
} {
  const ang = normalizeRad((angle * Math.PI) / 180)
  const angleOfPreviousLineRad = Math.atan2(
    arcStartPoint.y - previousPoint.y,
    arcStartPoint.x - previousPoint.x
  )
  const clockwise = isClockwise({
    fromAngle: angleOfPreviousLineRad,
    toAngle: ang,
    obtuse,
    arcType,
  })

  const onRightHandSide = clockwise === obtuse
  const angleToCircleCenter = onRightHandSide
    ? angleOfPreviousLineRad - Math.PI / 2
    : angleOfPreviousLineRad + Math.PI / 2
  const circleCenter = {
    x: arcStartPoint.x + Math.cos(angleToCircleCenter) * radius,
    y: arcStartPoint.y + Math.sin(angleToCircleCenter) * radius,
  }
  const angleFromCircleCenter = angleToCircleCenter + Math.PI // flip 180
  const perpendicularAngle = clockwise ? ang + Math.PI / 2 : ang - Math.PI / 2 // angle from the circle center to the final point
  const rotationDirection = deltaAngle({
    fromAngle: angleFromCircleCenter,
    toAngle: perpendicularAngle,
  })
  let midPointAngle = angleFromCircleCenter + rotationDirection / 2
  midPointAngle =
    (clockwise && rotationDirection > 0) ||
    (!clockwise && rotationDirection < 0)
      ? midPointAngle + Math.PI
      : midPointAngle
  midPointAngle = normalizeRad(midPointAngle)
  const onArc = {
    x: circleCenter.x + Math.cos(midPointAngle) * radius,
    y: circleCenter.y + Math.sin(midPointAngle) * radius,
  }
  const endPoint = {
    x: circleCenter.x + Math.cos(perpendicularAngle) * radius,
    y: circleCenter.y + Math.sin(perpendicularAngle) * radius,
  }
  return {
    circleCenter,
    startPoint: arcStartPoint,
    onArc,
    endPoint,
  }
}
type Point = [number, number]

export function offsetLine(
  offset: number,
  [x1, y1]: Point,
  [x2, y2]: Point
): [Point, Point] {
  if (x1 === x2) {
    const direction = Math.sign(y1 - y2)
    return [
      [x1 + offset * direction, y1],
      [x2 + offset * direction, y2],
    ]
  }
  if (y1 === y2) {
    const direction = Math.sign(x2 - x1)
    return [
      [x1, y1 + offset * direction],
      [x2, y2 + offset * direction],
    ]
  }
  const xOffset = offset / Math.sin(Math.atan2(y1 - y2, x1 - x2))
  return [
    [x1 + xOffset, y1],
    [x2 + xOffset, y2],
  ]
}

export function calculateIntersectionOfTwoLines({
  line1,
  line2Angle,
  line2Point,
}: {
  line1: Point[]
  line2Angle: number
  line2Point: Point
}) {
  const line2PointB: Point = [
    line2Point[0] + Math.cos((line2Angle * Math.PI) / 180) * 10,
    line2Point[1] + Math.sin((line2Angle * Math.PI) / 180) * 10,
  ]
  return intersect(line1[0], line1[1], line2Point, line2PointB)
}

function intersect(
  [x11, y11]: Point,
  [x12, y12]: Point,
  [x21, y21]: Point,
  [x22, y22]: Point
): Point {
  const slope = ([x1, y1]: Point, [x2, y2]: Point): number =>
    (y1 - y2) / (x1 - x2)
  const constant = (p1: Point, p2: Point): number =>
    p1[1] - slope(p1, p2) * p1[0]
  const getY = (forX: number, p1: Point, p2: Point): number =>
    slope(p1, p2) * forX + constant(p1, p2)

  if (x11 === x12) return [x11, getY(x11, [x21, y21], [x22, y22])]
  if (x21 === x22) return [x21, getY(x21, [x11, y11], [x12, y12])]

  const x =
    (constant([x21, y21], [x22, y22]) - constant([x11, y11], [x12, y12])) /
    (slope([x11, y11], [x12, y12]) - slope([x21, y21], [x22, y22]))
  const y = getY(x, [x11, y11], [x12, y12])
  return [x, y]
}

export function intersectionWithParallelLine({
  line1,
  line1Offset,
  line2Angle,
  line2Point,
}: {
  line1: Point[]
  line1Offset: number
  line2Angle: number
  line2Point: Point
}) {
  return calculateIntersectionOfTwoLines({
    line1: offsetLine(line1Offset, line1[0], line1[1]),
    line2Angle,
    line2Point,
  })
}

export function getTangentFromPoint({
  point,
  center,
  radius,
  clockwise = true,
}: {
  point: Point
  center: Point
  radius: number
  clockwise: boolean
}): { point: Point; angle: number } {
  const distancePointToCenter = distanceBetweenPoints(point, center)

  let deltaAngle = Math.acos(radius / distancePointToCenter)
  if (clockwise) {
    deltaAngle *= -1
  }
  const angleFromCenterToPoint = Math.atan2(
    point[1] - center[1],
    point[0] - center[0]
  )
  const finalAngle = normalizeRad(angleFromCenterToPoint + deltaAngle)
  const tangentPoint: Point = [
    center[0] + Math.cos(finalAngle) * radius,
    center[1] + Math.sin(finalAngle) * radius,
  ]
  const angle =
    (Math.atan2(tangentPoint[1] - point[1], tangentPoint[0] - point[0]) * 180) /
    Math.PI
  return {
    point: tangentPoint,
    angle,
  }
}

export function getTangentialPointOfTwoCircles({
  fromCenter,
  fromRadius,
  toCenter,
  toRadius,
  fromClockwise = true,
  toClockwise = true,
}: {
  fromCenter: Point
  fromRadius: number
  fromClockwise?: boolean
  toCenter: Point
  toRadius: number
  toClockwise?: boolean
}): {
  fromTangent: Point
  toTangent: Point
  angle: number
  length: number
} {
  // Math partly derived from https://gieseanw.wordpress.com/2012/09/12/finding-external-tangent-points-for-two-circles/
  // but only for the non-transverse case.
  const sq = (val: number): number => Math.pow(val, 2)
  const clockwiseSign = toClockwise ? 1 : -1
  const isTransverseTangent = toClockwise !== fromClockwise
  const isTransverseTangentSign = isTransverseTangent ? 1 : -1
  const radiusDiff = Math.abs(toRadius + fromRadius * isTransverseTangentSign)
  const distanceBetweenCenters = distanceBetweenPoints(fromCenter, toCenter)
  const distanceBetweenTangentPoints = Math.sqrt(
    sq(distanceBetweenCenters) - sq(radiusDiff)
  )
  const angleBetweenCenters = Math.atan2(
    toCenter[1] - fromCenter[1],
    toCenter[0] - fromCenter[0]
  )
  const distanceBetweenToCenterAndFromTangent = Math.sqrt(
    sq(toRadius) + sq(distanceBetweenTangentPoints)
  )
  let angleBetweenCircleCentersAndFromCenterToFromTanget = Math.acos(
    (sq(fromRadius) +
      sq(distanceBetweenCenters) -
      sq(distanceBetweenToCenterAndFromTangent)) /
      (2 * fromRadius * distanceBetweenCenters)
  )
  if (isTransverseTangent) {
    angleBetweenCircleCentersAndFromCenterToFromTanget = Math.acos(
      radiusDiff / distanceBetweenCenters
    )
  }
  const angleOfTangentialRadii =
    angleBetweenCircleCentersAndFromCenterToFromTanget * clockwiseSign +
    angleBetweenCenters

  const fromTangent: Point = [
    fromCenter[0] + Math.cos(angleOfTangentialRadii) * fromRadius,
    fromCenter[1] + Math.sin(angleOfTangentialRadii) * fromRadius,
  ]
  const toTangentFlipForTransverseTangent = isTransverseTangent ? Math.PI : 0
  const toTangent: Point = [
    toCenter[0] +
      Math.cos(angleOfTangentialRadii + toTangentFlipForTransverseTangent) *
        toRadius,
    toCenter[1] +
      Math.sin(angleOfTangentialRadii + toTangentFlipForTransverseTangent) *
        toRadius,
  ]
  const AngleOfTangentLine =
    (Math.atan2(toTangent[1] - fromTangent[1], toTangent[0] - fromTangent[0]) *
      180) /
    Math.PI

  return {
    fromTangent,
    toTangent,
    length: distanceBetweenTangentPoints,
    angle: AngleOfTangentLine,
  }
}
