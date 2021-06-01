# sketch-helpers

A number of 2d sketch helpers, they are 100% pure functions, no state to be found here.

I seemed to be obsessed with sketch helpers in Code-CAD applications, not only do I have [this OpenSCAD library](https://github.com/Irev-Dev/Round-Anything), but I also tried to add the following helpers to [CascadeStudio](https://github.com/zalo/CascadeStudio/pull/56). Unfortunately the latter was never merged, but I still think these are valuable at least to me. I'm likely to try and use these again at some point. I wouldn't consider this repo to be maintained, it's more "here for longevity".

I'm no TDD fanatic, but the methodology absolutely was a great help in this case. One challange I hit was with the test text, since tests serve double duty, primarily testing logic, but secondarily documenting the code, it can be hard to describe specific geometric secenarios, so I leveraged multiline template strings and everyone's favourite, 'ascii art', to draw the expected result.

Here's a dump of the test output to show what I mean:

```
 PASS  src/index.test.ts
  testing calculate3Points
    When the target angle is -90
      ✓ When clockwise and obtuse expect
      .-------------------------------- ~ - ,  startPoint
      .                                       ' ,
      .                                           , onArc
      .                                            ,
      .                                             ,
      .                                             , - endpoint
     (3 ms)
      ✓ When clockwise and acute expect
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
    
      ✓ When CCW and obtuse expect
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
     (1 ms)
      ✓ When CCW and acute expect
    .-------------------------, - ~ ~ startPoint
    .                     , '
    .                   , onArc
    .                  ,
    .                 ,
    .                 , endPoint
     (1 ms)
      ✓ When shortest and obtuse expect
    .-------------------------------- ~ - ,  startPoint
    .                                       ' ,
    .                                           , onArc
    .                                            ,
    .                                             ,
    .                                             , - endpoint
     (1 ms)
      ✓ When longest and obtuse expect
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
     (1 ms)
      ✓ When shortest and acute expect
    .-------------------------, - ~ ~ startPoint
    .                     , '
    .                   , onArc
    .                  ,
    .                 ,
    .                 , endPoint
     (1 ms)
      ✓ When longest and acute expect
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
    
    When the target angle is 90
      ✓ When clockwise and obtuse expect
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
    
      ✓ When clockwise and acute expect
    .                , endPoint
    .                ,
    .                 ,
    .                  , onArc
    .                    ,
    .______________________' - , _ _ startPoint
    
      ✓ When CCW and obtuse expect
    .                                             , endPoint
    .                                             ,
    .                                            , onArc
    .                                           ,
    .                                        , '
    ._____________________________ _ _ _ , startPoint
     (1 ms)
      ✓ When CCW and acute expect
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
     (1 ms)
      ✓ When shortest and obtuse expect
    .                                             , endPoint
    .                                             ,
    .                                            , onArc
    .                                           ,
    .                                        , '
    ._____________________________ _ _ _ , startPoint
     (1 ms)
      ✓ When longest and obtuse expect
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
     (1 ms)
      ✓ When shortest and acute expect
    .                , endPoint
    .                ,
    .                 ,
    .                  , onArc
    .                    ,
    .______________________' - , _ _ startPoint
     (1 ms)
      ✓ When longest and acute expect
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
    
  testing calculateIntersectionOfTwoLines
    ✓ two 45 degree angles
    ✓ horizontal and vertical line (1 ms)
    ✓ horizontal and angled line
    ✓ vertical and angled line (1 ms)
  testing offsetLine
    ✓ vertical line going up positive offset
    ✓ vertical line going up negative offset
    ✓ vertical line going down positive offset
    ✓ vertical line going down negative offset
    ✓ horizontal line going right positive offset
    ✓ horizontal line going right negative offset (1 ms)
    ✓ horizontal line going left positive offset
    ✓ horizontal line going left negative offset (1 ms)
    ✓ angled line line positive offset
    ✓ angled line line negative offset (1 ms)
  testing intersectionWithParallelLine
    ✓ 45 degree angle with offset and a vertical line
    ✓ two 45 degree angles, one offset
  testing pointToTangent
    ✓ When clockwise tangent (1 ms)
    ✓ When counterCW tangent (1 ms)
    ✓ When point is very far away from small circle, both points for clockwise and not should be close to 2*radius apart
  testing getTangentialPointOfTwoCircles
    ✓ when small to big clockwise circles where their tops are horizontal (1 ms)
    ✓ when big to small clockwise circles where their tops are horizontal (1 ms)
    ✓ when swapping the placement of the circles should mean the tangent runs along the bottom, and angle should be 180 (1 ms)
    ✓ when small to big counterCW circles where their bottoms are horizontal
    ✓ when circles of the same radius at 45deg angle
    ✓ when tangents are transverse, circles arranged such that tangent should be flat, first circle clockwise (1 ms)
    ✓ when tangents are transverse, circles arranged such that tangent should be flat, first circle counterCW (1 ms)
```
