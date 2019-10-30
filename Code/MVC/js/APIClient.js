import * as ColorPalette from './ColorPalette.js';

export default class APIClient {
    getRecord(playground) {
        switch (playground) {
            case 'Baseplayground':
                return APIClient.basePlaygroundRecord;
            case 'Obstacleplayground':
                return APIClient.obstaclePlaygroundRecord;
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


APIClient.obstaclePlaygroundRecord = {
    playground: [
        {
            name: 'Obstacleplayground',

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
                }
            ],

            planes: [
                {
                    name: 'Bottom plane',
                    props: {
                        width : APIClient.pgWidth,
                        height : APIClient.pgLength,
                        color : ColorPalette.LightGrey
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

