import {
  calculate3PointsForTangentialArc,
  Coordinate,
  calculateIntersectionOfTwoLines,
  offsetLine,
  intersectionWithParallelLine,
  getTangentFromPoint,
  getTangentialPointOfTwoCircles,
} from './index'

const round2decimal = (value: number): number => Math.round(value * 100) / 100

const roughRound = (val: number) => {
  const mult = 1000000
  return Math.round(val * mult) / mult
}

const roundPoints = (points: Coordinate[]): Coordinate[] =>
  points.map(({ x, y }) => ({ x: round2decimal(x), y: round2decimal(y) }))

const roundPoint = ({ x, y }: Coordinate): Coordinate => ({
  x: round2decimal(x),
  y: round2decimal(y),
})

describe('testing calculate3Points', () => {
  const diffOf45 = round2decimal(Math.cos(Math.PI / 4) * 3)
  const previousPoint = { x: 0, y: 0 }
  const arcStartPoint = { x: 5, y: 0 }
  const radius = 3

  describe(`When the target angle is -90`, () => {
    const targetAngle = -90
    it(`When clockwise and obtuse expect
      .-------------------------------- ~ - ,  startPoint
      .                                       ' ,
      .                                           , onArc
      .                                            ,
      .                                             ,
      .                                             , - endpoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: true,
            arcType: 'clockwise',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 + diffOf45, y: round2decimal(diffOf45 - 3) },
        { x: 8, y: -3 },
      ])
    })
    it(`When clockwise and acute expect
    .                         , - ~ ~ ~ - ,
    .                     , '               ' ,
    .                   ,  onArc                ,
    .                  ,                         ,
    .                 ,                           ,
    .                 ,                           , endPoint
    .                 ,
    .                  ,
    .                   ,
    .                     ,
    .______________________ ' - , _ _  startPoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: false,
            arcType: 'clockwise',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 - diffOf45, y: 3 + diffOf45 },
        { x: 8, y: 3 },
      ])
    })
    it(`When CCW and obtuse expect
    .                         , - ~ ~ ~ - ,
    .                     , '               ' ,
    .                   ,                       , onArc
    .                  ,                         ,
    .                 ,                           ,
    .                 , endPoint                  ,
    .                                             ,
    .                                            ,
    .                                           ,
    .                                        , '
    ._____________________________ _ _ _ , startPoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: true,
            arcType: 'counterCW',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 + diffOf45, y: 3 + diffOf45 },
        { x: 2, y: 3 },
      ])
    })
    it(`When CCW and acute expect
    .-------------------------, - ~ ~ startPoint
    .                     , '
    .                   , onArc
    .                  ,
    .                 ,
    .                 , endPoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: false,
            arcType: 'counterCW',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 - diffOf45, y: round2decimal(-3 + diffOf45) },
        { x: 2, y: -3 },
      ])
    })

    it(`When shortest and obtuse expect
    .-------------------------------- ~ - ,  startPoint
    .                                       ' ,
    .                                           , onArc
    .                                            ,
    .                                             ,
    .                                             , - endpoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: true,
            arcType: 'shortest',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 + diffOf45, y: round2decimal(-3 + diffOf45) },
        { x: 8, y: -3 },
      ])
    })

    it(`When longest and obtuse expect
    .                         , - ~ ~ ~ - ,
    .                     , '               ' ,
    .                   ,                       , onArc
    .                  ,                         ,
    .                 ,                           ,
    .                 , endPoint                  ,
    .                                             ,
    .                                            ,
    .                                           ,
    .                                        , '
    ._____________________________ _ _ _ , startPoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: true,
            arcType: 'longest',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 + diffOf45, y: 3 + diffOf45 },
        { x: 2, y: 3 },
      ])
    })

    it(`When shortest and acute expect
    .-------------------------, - ~ ~ startPoint
    .                     , '
    .                   , onArc
    .                  ,
    .                 ,
    .                 , endPoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: false,
            arcType: 'shortest',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 - diffOf45, y: round2decimal(-3 + diffOf45) },
        { x: 2, y: -3 },
      ])
    })

    it(`When longest and acute expect
    .                         , - ~ ~ ~ - ,
    .                     , '               ' ,
    .                   ,  onArc                ,
    .                  ,                         ,
    .                 ,                           ,
    .                 ,                           , endPoint
    .                 ,
    .                  ,
    .                   ,
    .                     ,
    .______________________ ' - , _ _  startPoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: false,
            arcType: 'longest',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 - diffOf45, y: 3 + diffOf45 },
        { x: 8, y: 3 },
      ])
    })
  })
  describe(`When the target angle is 90`, () => {
    const targetAngle = 90
    it(`When clockwise and obtuse expect
      .---------------------------- ~ ~ - , startPoint
      .                                      ' ,
      .                                          ,
      .                                           ,
      .                                            ,
      .                , endPoint                  ,
      .                ,                           ,
      .                 ,                         ,
      .                  ,                       ,
      .                    ,                  , ' onArc
      .                      ' - , _ _ _ ,  '
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: true,
            arcType: 'clockwise',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 + diffOf45, y: -3 - diffOf45 },
        { x: 2, y: -3 },
      ])
    })
    it(`When clockwise and acute expect
    .                , endPoint
    .                ,
    .                 ,
    .                  , onArc
    .                    ,
    .______________________' - , _ _ startPoint
    `, () => {
      const { circleCenter, startPoint, onArc, endPoint } =
        calculate3PointsForTangentialArc(
          radius,
          targetAngle,
          arcStartPoint,
          previousPoint,
          {
            obtuse: false,
            arcType: 'clockwise',
          }
        )
      const points = [startPoint, onArc, endPoint]
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoints(points)).toEqual([
        { x: 5, y: 0 },
        { x: 5 - diffOf45, y: round2decimal(3 - diffOf45) },
        { x: 2, y: 3 },
      ])
    })
    it(`When CCW and obtuse expect
    .                                             , endPoint
    .                                             ,
    .                                            , onArc
    .                                           ,
    .                                        , '
    ._____________________________ _ _ _ , startPoint
    `, () => {
      const {
        circleCenter,
        // startPoint,
        onArc,
        endPoint,
      } = calculate3PointsForTangentialArc(
        radius,
        targetAngle,
        arcStartPoint,
        previousPoint,
        {
          obtuse: true,
          arcType: 'counterCW',
        }
      )
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoint(onArc)).toEqual({
        x: 5 + diffOf45,
        y: round2decimal(3 - diffOf45),
      })
      expect(roundPoint(endPoint)).toEqual({ x: 8, y: 3 })
    })
    it(`When CCW and acute expect
    .------------------------, - ~ ~ startPoint
    .                    , '
    .                  ,
    .                 ,
    .                ,
    .                ,                           , endPoint
    .                ,                           ,
    .                 ,                         ,
    .                  , onArc                 ,
    .                    ,                  , '
    .                      ' - , _ _ _ ,  '
    `, () => {
      const {
        circleCenter,
        // startPoint,
        onArc,
        endPoint,
      } = calculate3PointsForTangentialArc(
        radius,
        targetAngle,
        arcStartPoint,
        previousPoint,
        {
          obtuse: false,
          arcType: 'counterCW',
        }
      )
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoint(onArc)).toEqual({ x: 5 - diffOf45, y: -3 - diffOf45 })
      expect(roundPoint(endPoint)).toEqual({ x: 8, y: -3 })
    })

    it(`When shortest and obtuse expect
    .                                             , endPoint
    .                                             ,
    .                                            , onArc
    .                                           ,
    .                                        , '
    ._____________________________ _ _ _ , startPoint
    `, () => {
      const {
        circleCenter,
        // startPoint,
        onArc,
        endPoint,
      } = calculate3PointsForTangentialArc(
        radius,
        targetAngle,
        arcStartPoint,
        previousPoint,
        {
          obtuse: true,
          arcType: 'shortest',
        }
      )
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoint(onArc)).toEqual({
        x: 5 + diffOf45,
        y: round2decimal(3 - diffOf45),
      })
      expect(roundPoint(endPoint)).toEqual({ x: 8, y: 3 })
    })

    it(`When longest and obtuse expect
    .---------------------------- ~ ~ - , startPoint
    .                                      ' ,
    .                                          ,
    .                                           ,
    .                                            ,
    .                , endPoint                  ,
    .                ,                           ,
    .                 ,                         ,
    .                  ,                       ,
    .                    ,                  , ' onArc
    .                      ' - , _ _ _ ,  '
    `, () => {
      const {
        circleCenter,
        // startPoint,
        onArc,
        endPoint,
      } = calculate3PointsForTangentialArc(
        radius,
        targetAngle,
        arcStartPoint,
        previousPoint,
        {
          obtuse: true,
          arcType: 'longest',
        }
      )
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoint(onArc)).toEqual({ x: 5 + diffOf45, y: -3 - diffOf45 })
      expect(roundPoint(endPoint)).toEqual({ x: 2, y: -3 })
    })

    it(`When shortest and acute expect
    .                , endPoint
    .                ,
    .                 ,
    .                  , onArc
    .                    ,
    .______________________' - , _ _ startPoint
    `, () => {
      const {
        circleCenter,
        // startPoint,
        onArc,
        endPoint,
      } = calculate3PointsForTangentialArc(
        radius,
        targetAngle,
        arcStartPoint,
        previousPoint,
        {
          obtuse: false,
          arcType: 'shortest',
        }
      )
      expect(circleCenter).toEqual({ x: 5, y: 3 })
      expect(roundPoint(onArc)).toEqual({
        x: 5 - diffOf45,
        y: round2decimal(3 - diffOf45),
      })
      expect(roundPoint(endPoint)).toEqual({ x: 2, y: 3 })
    })

    it(`When longest and acute expect
    .------------------------, - ~ ~ startPoint
    .                    , '
    .                  ,
    .                 ,
    .                ,
    .                ,                           , endPoint
    .                ,                           ,
    .                 ,                         ,
    .                  , onArc                 ,
    .                    ,                  , '
    .                      ' - , _ _ _ ,  '
    `, () => {
      const {
        circleCenter,
        // startPoint,
        onArc,
        endPoint,
      } = calculate3PointsForTangentialArc(
        radius,
        targetAngle,
        arcStartPoint,
        previousPoint,
        {
          obtuse: false,
          arcType: 'longest',
        }
      )
      expect(circleCenter).toEqual({ x: 5, y: -3 })
      expect(roundPoint(onArc)).toEqual({ x: 5 - diffOf45, y: -3 - diffOf45 })
      expect(roundPoint(endPoint)).toEqual({ x: 8, y: -3 })
    })
  })
})

describe(`testing calculateIntersectionOfTwoLines`, () => {
  it(`two 45 degree angles`, () => {
    const result = calculateIntersectionOfTwoLines({
      line1: [
        [0, 0],
        [1, 1],
      ],
      line2Point: [0, 4],
      line2Angle: -45,
    })
    expect(result.map((a) => roughRound(a))).toEqual([2, 2])
  })
  it(`horizontal and vertical line`, () => {
    const result = calculateIntersectionOfTwoLines({
      line1: [
        [0, 0],
        [10, 0],
      ],
      line2Point: [5, 5],
      line2Angle: -90,
    })
    expect(result.map((a) => roughRound(a))).toEqual([5, 0])
  })
  it(`horizontal and angled line`, () => {
    const result = calculateIntersectionOfTwoLines({
      line1: [
        [0, 0],
        [10, 0],
      ],
      line2Point: [5, 4],
      line2Angle: 45,
    })
    expect(result.map((a) => roughRound(a))).toEqual([1, 0])
  })
  it(`vertical and angled line`, () => {
    const result = calculateIntersectionOfTwoLines({
      line1: [
        [0, 0],
        [0, 10],
      ],
      line2Point: [5, 4],
      line2Angle: 45,
    })
    expect(result.map((a) => roughRound(a))).toEqual([0, -1])
  })
})

describe(`testing offsetLine`, () => {
  it(`vertical line going up positive offset`, () => {
    const result = offsetLine(5, [5, 0], [5, 5])
    expect(result).toEqual([
      [0, 0],
      [0, 5],
    ])
  })
  it(`vertical line going up negative offset`, () => {
    const result = offsetLine(-5, [5, 0], [5, 5])
    expect(result).toEqual([
      [10, 0],
      [10, 5],
    ])
  })
  it(`vertical line going down positive offset`, () => {
    const result = offsetLine(5, [5, 5], [5, 0])
    expect(result).toEqual([
      [10, 5],
      [10, 0],
    ])
  })
  it(`vertical line going down negative offset`, () => {
    const result = offsetLine(-5, [5, 5], [5, 0])
    expect(result).toEqual([
      [0, 5],
      [0, 0],
    ])
  })
  it(`horizontal line going right positive offset`, () => {
    const result = offsetLine(5, [0, 5], [5, 5])
    expect(result).toEqual([
      [0, 10],
      [5, 10],
    ])
  })
  it(`horizontal line going right negative offset`, () => {
    const result = offsetLine(-5, [0, 5], [5, 5])
    expect(result).toEqual([
      [0, 0],
      [5, 0],
    ])
  })
  it(`horizontal line going left positive offset`, () => {
    const result = offsetLine(5, [5, 5], [0, 5])
    expect(result).toEqual([
      [5, 0],
      [0, 0],
    ])
  })
  it(`horizontal line going left negative offset`, () => {
    const result = offsetLine(-5, [5, 5], [0, 5])
    expect(result).toEqual([
      [5, 10],
      [0, 10],
    ])
  })
  it(`angled line line positive offset`, () => {
    const result = offsetLine(5, [0, 0], [5, 5])
    expect(result).toEqual([
      [-7.071067811865475, 0],
      [-2.0710678118654746, 5],
    ])
  })
  it(`angled line line negative offset`, () => {
    const result = offsetLine(-5, [0, 0], [5, 5])
    expect(result).toEqual([
      [7.071067811865475, 0],
      [12.0710678118654755, 5],
    ])
  })
})

describe(`testing intersectionWithParallelLine`, () => {
  it(`45 degree angle with offset and a vertical line`, () => {
    const result = intersectionWithParallelLine({
      line1: [
        [0, 0],
        [1, 1],
      ],
      line1Offset: 1,
      line2Point: [5, 0],
      line2Angle: 90,
    })
    expect(result).toEqual([5, 6.414213562373095])
  })
  it(`two 45 degree angles, one offset`, () => {
    const result = intersectionWithParallelLine({
      line1: [
        [0, 0],
        [1, 1],
      ],
      line1Offset: 1 / Math.sin(Math.PI / 4),
      line2Point: [6, 0],
      line2Angle: 135,
    })
    expect(result.map((a) => roughRound(a))).toEqual([2, 4])
  })
})

describe(`testing pointToTangent`, () => {
  it(`When clockwise tangent`, () => {
    const { point: result, angle } = getTangentFromPoint({
      point: [0, 3],
      center: [6, 0],
      radius: 3,
      clockwise: true,
    })
    expect(result.map((a) => roughRound(a))).toEqual([6, 3])
    expect(roughRound(angle)).toBe(0)
    const { point: antiResult, angle: antiAngle } = getTangentFromPoint({
      point: [0, 3],
      center: [6, 0],
      radius: 3,
      clockwise: false,
    })
    expect(antiAngle < 0).toBeTruthy()
    expect(antiResult.map((a) => roughRound(a))).toEqual([3.6, -1.8])
  })
  it(`When counterCW tangent`, () => {
    const { point: result, angle } = getTangentFromPoint({
      point: [0, 0],
      center: [6, 3],
      radius: 3,
      clockwise: false,
    })
    expect(roughRound(angle)).toBe(0)
    expect(result.map((a) => roughRound(a))).toEqual([6, 0])
    const { point: antiResult, angle: antiAngle } = getTangentFromPoint({
      point: [0, 0],
      center: [6, 3],
      radius: 3,
      clockwise: true,
    })
    expect(antiAngle < 0).toBeFalsy()
    expect(antiResult.map((a) => roughRound(a))).toEqual([3.6, 4.8])
  })
  it(`When point is very far away from small circle, both points for clockwise and not should be close to 2*radius apart`, () => {
    const radius = 10
    const { point: result, angle } = getTangentFromPoint({
      point: [500000, 0],
      center: [-500000, 0],
      radius: radius,
      clockwise: false,
    })
    const { point: result2, angle: angle2 } = getTangentFromPoint({
      point: [500000, 0],
      center: [-500000, 0],
      radius: radius,
      clockwise: true,
    })
    const verticalDistance = Math.abs(result2[1] - result[1])
    expect(Math.round(Math.abs(angle))).toBe(180)
    expect(Math.round(Math.abs(angle2))).toBe(180)
    expect(roughRound(verticalDistance)).toEqual(radius * 2)
  })
})

describe(`testing getTangentialPointOfTwoCircles`, () => {
  it(`when small to big clockwise circles where their tops are horizontal`, () => {
    const { fromTangent, toTangent, angle, length } =
      getTangentialPointOfTwoCircles({
        fromCenter: [0, 0],
        fromRadius: 3,
        toCenter: [20, -3],
        toRadius: 6,
      })
    expect(fromTangent.map(roughRound)).toEqual([-0, 3])
    expect(toTangent.map(roughRound)).toEqual([20, 3])
    expect(angle).toBe(0)
    expect(length).toBe(20)
  })
  it(`when big to small clockwise circles where their tops are horizontal`, () => {
    const { fromTangent, toTangent, angle, length } =
      getTangentialPointOfTwoCircles({
        fromCenter: [0, -3],
        fromRadius: 6,
        toCenter: [20, 0],
        toRadius: 3,
      })
    expect(fromTangent.map(roughRound)).toEqual([0, 3])
    expect(toTangent.map(roughRound)).toEqual([20, 3])
    expect(angle).toBe(0)
    expect(length).toBe(20)
  })
  it(`when swapping the placement of the circles should mean the tangent runs along the bottom, and angle should be 180`, () => {
    const { fromTangent, toTangent, angle, length } =
      getTangentialPointOfTwoCircles({
        fromCenter: [20, 0],
        fromRadius: 3,
        toCenter: [0, 3],
        toRadius: 6,
      })
    expect(fromTangent.map(roughRound)).toEqual([20, -3])
    expect(toTangent.map(roughRound)).toEqual([0, -3])
    expect(angle).toBe(180)
    expect(length).toBe(20)
  })
  it(`when small to big counterCW circles where their bottoms are horizontal`, () => {
    const { fromTangent, toTangent, angle, length } =
      getTangentialPointOfTwoCircles({
        fromCenter: [0, 0],
        fromRadius: 3,
        toCenter: [20, 3],
        toRadius: 6,
        toClockwise: false,
        fromClockwise: false,
      })
    expect(fromTangent.map(roughRound)).toEqual([-0, -3])
    expect(toTangent.map(roughRound)).toEqual([20, -3])
    expect(angle).toBe(0)
    expect(length).toBe(20)
  })
  it(`when circles of the same radius at 45deg angle`, () => {
    const makeTestEasyRadius = 1 / Math.sin(Math.PI / 4)
    const { fromTangent, toTangent, angle, length } =
      getTangentialPointOfTwoCircles({
        fromCenter: [0, 0],
        fromRadius: makeTestEasyRadius,
        toCenter: [5, 5],
        toRadius: makeTestEasyRadius,
      })
    expect(fromTangent.map(roughRound)).toEqual([-1, 1])
    expect(toTangent.map(roughRound)).toEqual([4, 6])
    expect(angle).toBe(45)
    expect(roughRound(length)).toBe(roughRound(Math.sqrt(Math.pow(5, 2) * 2)))
  })

  it(`when tangents are transverse, circles arranged such that tangent should be flat, first circle clockwise`, () => {
    const { fromTangent, toTangent, angle, length } =
      getTangentialPointOfTwoCircles({
        fromCenter: [0, 3],
        fromRadius: 3,
        toClockwise: false,
        toCenter: [20, -6],
        toRadius: 6,
        fromClockwise: true,
      })
    expect(fromTangent.map(roughRound)).toEqual([0, 0])
    expect(toTangent.map(roughRound)).toEqual([20, 0])
    expect(angle).toBe(0)
    expect(length).toBe(20)
  })
  it(`when tangents are transverse, circles arranged such that tangent should be flat, first circle counterCW`, () => {
    const { fromTangent, toTangent, angle, length } =
      getTangentialPointOfTwoCircles({
        fromCenter: [0, -3],
        fromRadius: 3,
        toClockwise: true,
        toCenter: [20, 6],
        toRadius: 6,
        fromClockwise: false,
      })
    expect(fromTangent.map(roughRound)).toEqual([0, 0])
    expect(toTangent.map(roughRound)).toEqual([20, 0])
    expect(angle).toBe(0)
    expect(length).toBe(20)
  })
})
