/**
 * 
 *  @author  Quentinflueckiger   /   https://github.com/Quentinflueckiger
 */

import * as ColorPalette from './ColorPalette.js';

/**
 * A class filled with the data of the prebuilt playgrounds.
 */
export default class APIClient {

    /**
     * 
     * @param {String}  playground The wanted playground to load
     * @return {Object}            The object containing the information about the wanted playground
     */
    getRecord(playground) {
        switch (playground) {
            case 'Baseplayground':
                return APIClient.basePlaygroundRecord;
            case 'Obstacleplayground':
                return APIClient.obstaclePlaygroundRecord;
            case 'Borderlessplayground' :
                return APIClient.borderlessPlaygroundRecord;
            default:
                break;
        }
    }
}

APIClient.wallHeight = 6;
APIClient.wallDepth = 1;
APIClient.pgWidth = 50;
APIClient.pgLength = 50;

APIClient.basePlaygroundRecord = {
    playground: [
        {
            name: 'Baseplayground',

            boxes: [
                {
                    name: 'N Wall',
                    props: {
                        width : APIClient.wallDepth,
                        height : APIClient.wallHeight,
                        depth : APIClient.pgWidth + APIClient.wallDepth,
                        color : ColorPalette.Grey,
                        positionX : -APIClient.pgWidth/2,
                        positionZ : 0
                    }
                },
                {
                    name: 'E Wall',
                    props: {
                        width : APIClient.pgWidth + APIClient.wallDepth,
                        height : APIClient.wallHeight,
                        depth : APIClient.wallDepth,
                        color : ColorPalette.Grey,
                        positionX : 0,
                        positionZ : -APIClient.pgWidth/2
                    }
                },
                {
                    name: 'S Wall',
                    props: {
                        width : APIClient.wallDepth,
                        height : APIClient.wallHeight,
                        depth : APIClient.pgWidth + APIClient.wallDepth,
                        color : ColorPalette.Grey,
                        positionX : APIClient.pgWidth/2,
                        positionZ : 0
                    }
                },
                {
                    name: 'W Wall',
                    props: {
                        width : APIClient.pgWidth + APIClient.wallDepth,
                        height : APIClient.wallHeight,
                        depth : APIClient.wallDepth,
                        color : ColorPalette.Grey,
                        positionX : 0,
                        positionZ : APIClient.pgWidth/2
                    }
                }
            ],

            planes: [
                {
                    name: 'Bottom plane',
                    props: {
                        width : APIClient.pgWidth,
                        height : APIClient.pgLength,
                        color : ColorPalette.LightGrey
                    },
                    hasWalls: true
                }
            ],

            thymios: [
                {
                    name: 'Thymio'
                }
            ]
        }
    ]
};


APIClient.obstaclePlaygroundRecord = {
    playground: [
        {
            name: 'Obstacleplayground',

            octagons: [
                {
                    name: 'Bottom octagon',
                    props: {
                        segmentLength : APIClient.pgWidth,
                        color : ColorPalette.LightGrey
                    },
                    hasWalls: true
                }
            ],

            uShapes: [
                {
                    name: 'Central UShape',
                    props: {
                        height : APIClient.wallHeight,
                        positionX : 0,
                        positionZ : 0,
                        size : 3,
                        color : ColorPalette.Grey
                    }
                }
            ],

            cylinders: [
                {
                    name : 'TLC1',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -14,
                        positionZ : -14,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'TLC2',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -17,
                        positionZ : -17,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'TLC3',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -20,
                        positionZ : -20,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'TLC4',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -23,
                        positionZ : -23,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'TLC5',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -26,
                        positionZ : -26,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'TLC6',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -29,
                        positionZ : -29,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'TLC7',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -32,
                        positionZ : -32,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC1',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -58,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC2',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -54,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC3',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -50,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC4',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -46,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC5',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -42,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC6',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -38,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC7',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -34,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC8',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -30,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'MLC9',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -26,
                        positionZ : 0,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC1',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -14,
                        positionZ : 14,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC2',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -17,
                        positionZ : 17,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC3',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -20,
                        positionZ : 20,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC4',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -23,
                        positionZ : 23,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC5',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -26,
                        positionZ : 26,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC6',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -35,
                        positionZ : 35,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC7',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -38,
                        positionZ : 38,
                        color : ColorPalette.Grey
                    }
                },
                {
                    name : 'BLC8',
                    props: {
                        topRadius : 2,
                        botRadius : 2,
                        height : APIClient.wallHeight,
                        positionX : -41,
                        positionZ : 41,
                        color : ColorPalette.Grey
                    }
                }
            ],

            tracks: [
                {
                    name: 'Base Track',
                    props: {
                        color : ColorPalette.Red,
                        points : [
                            {
                                positionX : 0,
                                positionZ : 0
                            },
                            {
                                positionX : 25,
                                positionZ : 0
                            },
                            {
                                positionX : 35,
                                positionZ : 10
                            },
                            {
                                positionX : 35,
                                positionZ : 35
                            },
                            {
                                positionX : 25,
                                positionZ : 45
                            },
                            {
                                positionX : -20,
                                positionZ : 40
                            },
                            {
                                positionX : -34,
                                positionZ : 28
                            },
                            {
                                positionX : -34,
                                positionZ : 23
                            },
                            {
                                positionX : -18,
                                positionZ : 6
                            },
                            {
                                positionX : -18,
                                positionZ : -6
                            },
                            {
                                positionX : -40,
                                positionZ : -25
                            },
                            {
                                positionX : -40,
                                positionZ : -35
                            },
                            {
                                positionX : -30,
                                positionZ : -45
                            },
                            {
                                positionX : 25,
                                positionZ : -45
                            },
                            {
                                positionX : 35,
                                positionZ : -35
                            },
                            {
                                positionX : 35,
                                positionZ : -10
                            },
                            {
                                positionX : 25,
                                positionZ : 0
                            }
                        ]

                    }
                }
            ],

            thymios: [
                {
                    name: 'Thymio'
                }
            ]
        }
    ]
};

//
APIClient.borderlessPlaygroundRecord = {
    playground: [
        {
            name: 'Borderlessplayground',

            octagons: [
                {
                    name: 'Bottom octagon',
                    props: {
                        segmentLength : APIClient.pgWidth,
                        color : ColorPalette.LightGrey
                    },
                    hasWalls : false
                }
            ],

            tracks: [
                {
                    name: 'Base Track',
                    props: {
                        color : ColorPalette.Red,
                        points : [
                            {
                                positionX : 0,
                                positionZ : 0
                            },
                            {
                                positionX : 20,
                                positionZ : 0
                            },
                            {
                                positionX : 52,
                                positionZ : 32
                            }
                        ]
                    }
                }
            ],

            thymios: [
                {
                    name: 'Thymio'
                }
            ]
        }
    ]
};

