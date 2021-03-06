import { resolve } from 'path';
const fs         = require('fs');
const fileExists = require('file-exists');
const pdf        = require('html-pdf');
const path       = require("path");
const ObjectId   = require('mongodb').ObjectID;

// const devModPath = resolve(__dirname, '..', '..', '..', 'src');
// const prodModPath = resolve(process.cwd(), '..',  'dist', 'desktop');
const devModPath = resolve(__dirname, '..', '..', '..', 'src');
const prodModPath = resolve(process.cwd(), 'dist', 'desktop');
const PDF_UPLOADS_PATH = 'uploads/pdf';

export class PDFGeneratorModel {

    rootPath: any = '';
    collection: any;
    flatInfo: any = { flat: 1 };
    params: any;

    constructor(public db: any) {
        this.collection = db.collection('addresses');
    }

    public convert(html) {
        return new Promise( (res, rej) => {
            const options = {
                format: 'A4',
                orientation: 'landscape',
                base: `file:///${prodModPath}/`,
                script: `${this.rootPath}/assets/html-pdf/pdf_a4_portrat.js`,
                quality: '100',
                // phantomPath:  '/home/shepotmonaha/Public/novotomilino/node_modules/phantomjs-prebuilt/bin/phantomjs',
            };

            pdf.create(html, options).toFile(`./${PDF_UPLOADS_PATH}/businesscard.pdf`, (err, file) => {
                console.log('in pdf Create ', file);
                console.log('in pdf Create ', err);
                res(file.filename);
            });
        });
    }

    public forSelectFloor(pathSVG, info) {

        if (fileExists.sync(pathSVG)) {
            let svgFloor;
            let id;
            id =  `_${info.flat}`;
            svgFloor = fs.readFileSync(pathSVG, 'utf8').replace(/cls|st(?=\d)/g, "floorst").replace(
                `id="${id}"`,
                `id="active-flat"`
            );
            return svgFloor;
        }
    }
    public forSelectFlat(pathSVG) {
        if (fileExists.sync(pathSVG)) {
            let svgFlat;
            return svgFlat = fs.readFileSync(pathSVG, 'utf8').replace(/cls|st(?=\d)/g, "roomst");
        }
    }
    public getFlat(id) {

        return new Promise( (res, rej) => {
            let flatCollection = this.db.collection('addresses');
            flatCollection.findOne({_id : id}, (err, flat) => {
                res(flat);
            });
        });
    }

    public async create(req) {

        this.params = req.params.mod;
        this.rootPath = (req.params.mod !== 'prod') ? devModPath : prodModPath;

        console.log('this.rootPath -> ', this.rootPath);

        return await (async () => {
            const flat: any = await this.getFlat(ObjectId(req.params.id));
            const phoneNumber = '+7-499-350-75-48';

            this.flatInfo = {
                section: flat.section,
                decoration: flat.decorationName,
                house: flat.house,
                floor: flat.floor,
                flat: flat.flat,
                price: String(flat.price).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '),
                space: String(flat.space),
                rooms: (flat.rooms == '0')
                    ? '????????????????-????????????'
                    : (flat.rooms == '1') ? '1-????????. ????????????????'
                    : (flat.rooms == '2') ? '2-????????. ????????????????'
                    : '3-????????. ????????????????',
            };

            let pathSVGFloor = `${(req.params.mod !== 'prod') ? devModPath : prodModPath}/assets/floor-plans/house_${flat.house}/section_${flat.section}/floor_${flat.floor}/sect_${flat.section}_fl_${flat.floor}.svg`;
            let pathSVGFlat = `${(req.params.mod !== 'prod') ? devModPath : prodModPath}/assets/floor-plans/house_${flat.house}/section_${flat.section}/floor_${flat.floor}/${flat.floor}floor_${flat.flat}flat.svg`;

            const svgFloor = await this.forSelectFloor(pathSVGFloor, this.flatInfo);
            const svgFlat = await this.forSelectFlat(pathSVGFlat);
            const html = await this.htmlRender(svgFloor, svgFlat, phoneNumber, this.flatInfo);
            const result = await this.convert(html);
            const way = `/${PDF_UPLOADS_PATH}/businesscard.pdf`;

            return way;
        })();
    }

    public get style() { return `
        @font-face {
            font-family: "abrade-book";
            src: url("file:///${this.params !== 'prod' ? devModPath : prodModPath}/assets/fonts/MuseoSansCyrl_300.otf');
            src: local('Museo'), local('Museo'),
            url('/assets/fonts/MuseoSansCyrl_300.otf');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'LeksaSans';
            src: url('file:///${this.params !== 'prod' ? devModPath : prodModPath}/assets/fonts/Leksa.otf');
            src: local('Leksa'), local('Leksa'),
            url('/assets/fonts/Leksa.otf');
            font-weight: normal;
            font-style: normal;
        }

        body {
            margin: 0;
            padding: 0;
        }

        .pdf-generate__page{
            height:157.3mm;
            width:222.7mm;
            box-sizing: border-box;
            position:relative;
            overflow: hidden;
        }

        .pdf-generate__page 
        .pdf-generate__header {
            height:15%;
            width:100%;
            box-sizing:border-box;
            position: relative;
        }

        .pdf-generate__header-logo {
            height: 20mm;
            width: 30mm;
            position: absolute;
            bottom: 0;
            left: 18mm;
        }

        .pdf-generate__header-logo svg {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }

        .pdf-generate__header-addr {
            font: 2.5mm "abrade-book";
            position: absolute;
            top: 8mm;
            left: 53mm;
            color: #404040;
        }

        .pdf-generate__header-addr-item {
            margin-bottom: 4px;
        }

        .pdf-generate__header-addr-item:first-child {
            margin-bottom: 6px;
        }

        .pdf-generate__side-menu {
            height: 85%;
            box-sizing: border-box;
            position: absolute;
            top: 15%;
            left: 18mm;
            display: -webkit-box;
            display: -moz-box; 
            display: -ms-flexbox;  
            display: -webkit-flex;     
            display: flex;  
            -webkit-align-items: center; 
            align-items: center; 
        }

        .pdf-generate__side-menu-content {
            box-sizing: border-box;
        }

        .side-menu-content-info {

        }

        .side-menu-content-plan {

        }

        .pdf-generate__side-menu-content-addr {
            margin-bottom: 5mm;
        }

        .pdf-generate__side-menu-content-addr-flat {
            font: 6mm "LeksaSans";
            color: #1A1A1A;
            margin-bottom: 3px;
        }

        .pdf-generate__side-menu-content-addr-other {
            white-space: nowrap;
        }

        .pdf-generate__side-menu-content-addr-other-item {
            display: inline-block;
            font: 2.5mm "abrade-book";
            color: #404040;
        }

        .pdf-generate__side-menu-content-addr-other-item:not(:last-child):after {
            content:"";
            position:absolute;
            top:5px;
            right:-5px;
            height:3px;
            width:3px;
            border-radius:50%;
            box-sizing:border-box;
            background:#404040;
        }

        .pdf-generate__side-menu-content-addr-other-item:not(:last-child) {
            margin-right:5px;
            position:relative;
        }

        .pdf-generate__side-menu-content-info {
            margin-top: 8mm;
        }

        .pdf-generate__side-menu-content-info-room, .pdf-generate__side-menu-content-info-space, .pdf-generate__side-menu-content-info-price {
            font: 6mm "LeksaSans";
            color: #1A1A1A;
            white-space: nowrap;
            margin-bottom: 5px;
        }

        .pdf-generate__side-menu-content-info-space sup {
            font: 3mm "LeksaSans";
        }

        .pdf-generate__side-menu-content-info-decoration {
            font: 3.5mm "LeksaSans";
            color: #404040;
            white-space: nowrap;
            margin-bottom: 5mm;
        }

        .pdf-generate__floor-plan {
            position: absolute;
            top: 0;
            right: 10%;
            height: 100%;
            box-sizing: border-box;
            width: 56%;
            display: -webkit-box;
            display: -moz-box; 
            display: -ms-flexbox;  
            display: -webkit-flex;     
            display: flex;  
            -webkit-align-items: center; 
            align-items: center; 
        }

        .pdf-generate__floor-plan svg {
            display: inline-block;
            width:100%;
            height:auto;
            max-height:68%;
        }

        .pdf-generate__floor-plan svg text {
            font: 2mm "abrade-book";
        }

        .pdf-generate__flat-plan svg text {
            font-family: "abrade-book" !important;
        }

        .pdf-generate__flat-plan {
            position: absolute;
            top: 0;
            right: 10%;
            height: 100%;
            box-sizing: border-box;
            width: 44%;
            display: -webkit-box;
            display: -moz-box; 
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
        }

        .pdf-generate__flat-plan svg {
            display: inline-block;
            width:100%;
            height:auto;
            max-height:68%;
        }

        #active-flat,
        #active-flat *,
        .active-flat * {
            fill: #aaab22 !important;
            opacity: .3;
        }

        .pdf-generate__side-menu-content-gkplan {
            margin-top: 5mm;
            width: 35mm;
            height: 50mm;
        }

        .pdf-generate__side-menu-content-gkplan svg {
            width: 35mm;
            height: 100% !important;
        }

        .flats_aside_scheme {
            width: 100%;
            height: 100%;
            font-family: 'abrade-book', sans-serif;
        }
        .flats_aside_scheme_link {
            cursor: pointer;
        }
        
        .flats_aside_scheme_count {
            font: 17px 'abrade-book', sans-serif;
            fill: #888ba2;
            stroke: #888ba2;
            z-index: 1;
        }
        
        .flats_aside_scheme_section {
            fill: transparent;
            stroke: #888BA2;
            stroke-width: 0.932;
            stroke-miterlimit: 10;
            cursor: pointer;
        }
        
        .flats_aside_scheme_figure {
            fill: transparent;
            stroke: #888BA2;
            stroke-width: 0.932;
            stroke-miterlimit: 10;
        }
        
        .flats_aside_scheme_fill {
            fill: #888BA2;
        }
    `; }

    public htmlRender (svgFloor, svgFlat, phoneNumber, addr) {
        return `
            <html>
  
              <head>
                <meta charset="UTF-8">
                <title>???? &#171;??????&#187;</title>
                
              </head>
            
              <body>

                  <style>
                      ${this.style}
                  </style>

                <div class="pdf-generate__page">
                    <div class="pdf-generate__header">
                        <div class="pdf-generate__header-logo">
                            ${this.logotype}
                        </div>
                        <div class="pdf-generate__header-addr">
                            <div class="pdf-generate__header-addr-item">?????????????? ?????????????????? ??????????, ???????????????? ??????</div>
                            <div class="pdf-generate__header-addr-item">${phoneNumber}</div>
                            <div class="pdf-generate__header-addr-item">info@bsa-dom.ru</div>
                            <div class="pdf-generate__header-addr-item">novotomilino.ru</div>
                        </div>
                    </div>
                    <div class="pdf-generate__side-menu">
                        <div class="pdf-generate__side-menu-content side-menu-content-plan">

                            <div class="pdf-generate__side-menu-content-addr">
                                <div class="pdf-generate__side-menu-content-addr-flat">????. ???${addr.flat}</div>
                                <div class="pdf-generate__side-menu-content-addr-other">
                                    <div class="pdf-generate__side-menu-content-addr-other-item">???????????? ${addr.house}</div>
                                    <div class="pdf-generate__side-menu-content-addr-other-item">???????????? ${addr.section}</div>
                                    <div class="pdf-generate__side-menu-content-addr-other-item">???????? ${addr.floor}</div>
                                </div>
                            </div>

                            <div class="pdf-generate__side-menu-content-gkplan">${this.gkPlan(addr.house)}</div>
                            
                        </div>
                    </div>
                    <div class="pdf-generate__floor-plan">${svgFloor}</div>
                </div>


                <div class="pdf-generate__page">
                    <div class="pdf-generate__header">
                        <div class="pdf-generate__header-logo">
                            ${this.logotype}
                        </div>
                        <div class="pdf-generate__header-addr">
                        <div class="pdf-generate__header-addr-item">?????????????? ?????????????????? ??????????, ???????????????? ??????</div>
                        <div class="pdf-generate__header-addr-item">${phoneNumber}</div>
                        <div class="pdf-generate__header-addr-item">info@bsa-dom.ru</div>
                        <div class="pdf-generate__header-addr-item">novotomilino.ru</div>
                        </div>
                    </div>
                    <div class="pdf-generate__side-menu">
                        <div class="pdf-generate__side-menu-content side-menu-content-info">
                            <div class="pdf-generate__side-menu-content-addr">
                                <div class="pdf-generate__side-menu-content-addr-flat">????. ???${addr.flat}</div>
                                <div class="pdf-generate__side-menu-content-addr-other">
                                    <div class="pdf-generate__side-menu-content-addr-other-item">???????????? ${addr.house}</div>
                                    <div class="pdf-generate__side-menu-content-addr-other-item">???????????? ${addr.section}</div>
                                    <div class="pdf-generate__side-menu-content-addr-other-item">???????? ${addr.floor}</div>
                                </div>
                            </div>

                            <div class="pdf-generate__side-menu-content-info">
                                <div class="pdf-generate__side-menu-content-info-room">${addr.rooms}</div>
                                <div class="pdf-generate__side-menu-content-info-space">${addr.space} ??<sup>2</sup></div>
                                <div class="pdf-generate__side-menu-content-info-decoration">${addr.decoration}</div>
                                <div class="pdf-generate__side-menu-content-info-price" style="position: relative; display: inline-block; padding-right: 20px;">${addr.price}
                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                    	 width="11px" height="15px" viewBox="0 0 19.9 25.4" style="position: absolute; right: 0; top: 2; enable-background:new 0 0 19.9 25.4;" xml:space="preserve">
                                        <style type="text/css">
                                        	.ruble{fill:#1A1A1A;}
                                        </style>
                                        <g>
                                        	<g>
                                        		<path class="ruble" d="M0,11.6h2.9V0H11c6,0,8.9,2.5,8.9,7.6c0,4.9-2.9,7.6-8.4,7.6h-4v2h6v3.6h-6v4.7H2.9v-4.7H0v-3.6h2.9v-2H0
                                        			V11.6z M10.3,11.6c3.6,0,5.1-1.3,5.1-4c0-2.8-1.5-4-5.1-4H7.4v8.1H10.3z"/>
                                        	</g>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pdf-generate__flat-plan">
                        ${svgFlat}
                    </div>
                </div>
              </body>
            
            </html>
        
        `;
    }

    public gkPlan(house) {

        // <svg class="flats_aside_scheme" viewBox="0 0 170.7 176">

        //     <style type="text/css">
        //         #_x3${section}_ * {fill: #83d6f4 !important;}
        //     </style>
        
        //     <g id="_x36_">
        //         <polyline class="flats_aside_scheme_section" points="144.9,109 134.5,120.1 147.3,132 170,107.4 157.2,95.9 144.9,109 	"/>
        //         <text transform="matrix(1 0 0 1 148.2101 118.2705)" class="flats_aside_scheme_count">6</text>
        //     </g>
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="143" height="361" viewBox="0 0 143 361" class="flats_aside_scheme">
            
            <style>
                #sect_${house} {
                    fill: #e7490f !important;
                    stroke: #e7490f !important;
                }
            </style>
            <g fill="none" fill-rule="evenodd">

                <path id="sect_1" class="flats_aside_scheme_section"
                    fill="#e6e6e8" d="M45.5 12.5h-20v36h-12V.5h32v12z"></path>
                <text fill="#000105" font-family="MuseoSansCyrl-500, Museo Sans Cyrl" font-size="14" transform="translate(-20 -113)">
                    <tspan x="21" y="141">1</tspan>
                </text>

                <path id="sect_2" class="flats_aside_scheme_section"
                    fill="#e6e6e8" d="M25.5 56.5v48h-12v-48z"></path>
                <text fill="#000105" font-family="MuseoSansCyrl-500, Museo Sans Cyrl" font-size="14" transform="translate(-76 -57)">
                    <tspan x="76" y="141">2</tspan>
                </text>

                <path id="sect_3" class="flats_aside_scheme_section"
                    fill="#e6e6e8" d="M25.5 112.5v48h-12v-48z"></path>
                <text fill="#000105" font-family="MuseoSansCyrl-500, Museo Sans Cyrl" font-size="14" transform="translate(-131.5 -1.5)">
                    <tspan x="132" y="141">3</tspan>
                </text>

                <path id="sect_9" class="flats_aside_scheme_section"
                    transform="translate(0 -150)"
                    fill="#e6e6e8" d="M25.5 320.5v40h-12v-40z"></path>
                <text fill="#000105" font-family="MuseoSansCyrl-500, Museo Sans Cyrl" font-size="14" transform="translate(-336 53)">
                    <tspan x="336" y="141">9</tspan>
                </text>
            </g>
        </svg>
        
        `;
    }

    public logotype = `
        <svg width="192px" height="30px" viewBox="0 0 192 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <title>1</title>
            <desc>Created with Sketch.</desc>
            <g id="??????????????++" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="????????????????????????_????????????" transform="translate(-41.000000, -108.000000)" fill-rule="nonzero">
                    <g id="??????????" transform="translate(0.000000, -1.000000)">
                        <g id="1" transform="translate(41.000000, 109.000000)">
                            <g id="Group" transform="translate(39.896104, 7.500000)" fill="#000105">
                                <polygon id="Path" points="2.22232709 8.98679748 2.22232709 15.0163517 1.20792265e-13 15.0163517 1.20792265e-13 0.0575339147 2.21656977 0.0575339147 2.21656977 6.89256298 9.87381078 6.89256298 9.87381078 0.0690406977 12.1191672 0.0690406977 12.1191672 15.0278585 9.89108275 15.0278585 9.89108275 8.98679748"></polygon>
                                <path d="M79.5259174,15.0393653 L76.6990713,6.28845688 L76.6011968,6.28845688 L75.8469873,15.137173 L73.7570787,14.947311 C73.8204092,14.285671 73.8837398,13.6470446 73.9528277,13.0084181 C74.1140328,11.4741804 74.277157,9.95144945 74.4422002,8.44022529 C74.5918907,7.03639777 74.7358238,5.63257025 74.8970288,4.23449612 C74.937482,4.1135558 75.0376718,4.0221406 75.1618658,3.99285368 C76.0024351,3.99285368 76.8430044,3.99285368 77.6835737,3.99285368 C77.9253813,3.99285368 77.9599252,4.13093508 78.0117412,4.29203004 L79.7792397,9.84405281 L80.6140516,12.4675993 C80.7004115,12.2432171 80.7522274,12.1051357 80.798286,11.9670543 C81.6446127,9.42405523 82.4966966,6.8810562 83.3315086,4.33230378 C83.3471063,4.22757092 83.4039269,4.13340514 83.4893382,4.07074095 C83.5747495,4.00807675 83.6816727,3.98210769 83.7863372,3.99860707 C84.5808479,3.99860707 85.3696013,3.99860707 86.1641121,3.99860707 C86.4059197,3.99860707 86.4807649,4.09066134 86.5037942,4.30929021 C86.7225725,6.51092135 86.9471081,8.71255249 87.1774011,10.9141836 C87.3098195,12.1971899 87.4537526,13.4744428 87.5976857,14.7574491 C87.5976857,14.814983 87.5976857,14.8782703 87.5976857,14.9875848 L85.4041453,15.1659399 L84.6441785,6.28270349 L84.5347893,6.28270349 C84.4887307,6.39201793 84.4369148,6.49557897 84.3966136,6.6106468 C83.515743,9.28022045 82.6233577,11.9555475 81.7597591,14.6308745 C81.65037,14.9645712 81.5179515,15.0968992 81.1840267,15.0738857 C80.6255663,15.0163517 80.0901352,15.0393653 79.5259174,15.0393653 Z" id="Path"></path>
                                <path d="M35.5917774,8.87172965 C36.4055094,9.2498587 37.0132939,9.96441086 37.2556441,10.8278828 C37.6180538,12.392389 36.7913581,13.9886007 35.3039112,14.5963542 C34.7730316,14.8343755 34.2035262,14.9747056 33.6227726,15.0105984 C31.8322448,15.0623789 30.041717,15.0105984 28.193616,15.0105984 L28.193616,14.6078609 C28.193616,11.1960998 28.193616,7.78433866 28.193616,4.37257752 C28.193616,4.02737403 28.2914905,3.91805959 28.6426873,3.89504603 C29.5408298,3.83751211 30.433215,3.72244428 31.3313576,3.64765019 C32.3153822,3.54106572 33.3108367,3.64701804 34.2503209,3.95833333 C35.041459,4.1905027 35.692465,4.75499311 36.0339976,5.50496787 C36.3755301,6.25494264 36.373828,7.11626521 36.029334,7.86488614 C35.9141876,8.21584302 35.7529825,8.52077277 35.5917774,8.87172965 Z M30.3238259,13.3018411 C31.2910563,13.3018411 32.2295002,13.3478682 33.1564293,13.3018411 C33.6119263,13.2547754 34.0508542,13.1052878 34.4403126,12.8645833 C35.0419662,12.4467808 35.2797749,11.672054 35.016045,10.9889777 C34.8113464,10.3604736 34.1771866,9.97632273 33.5248981,10.0856953 C33.1621867,10.0856953 32.7994752,10.1317224 32.4310065,10.1604893 L30.3238259,10.3273377 L30.3238259,13.3018411 Z M30.3238259,8.69912791 L32.7534166,8.53803295 C33.7609484,8.46323886 33.8645802,8.37693798 34.1006305,7.38735465 L34.1006305,7.3528343 C34.3078941,6.39201793 33.9797267,5.74763808 33.1334,5.52900921 C32.2023432,5.34939243 31.244435,5.36113788 30.3180686,5.56352955 L30.3238259,8.69912791 Z" id="Shape"></path>
                                <path d="M90.5742223,4.00436047 L92.8023067,4.00436047 C92.7562481,6.58187984 92.8713946,9.14213905 92.7274615,11.6793847 C92.7274615,11.6793847 92.7274615,11.6793847 92.7735201,11.6448643 C94.5007173,9.41830184 96.2279145,7.2205063 97.9148105,4.95367006 C98.421455,4.3150436 98.7208359,3.98710029 98.7208359,3.98710029 L100.373188,3.98710029 L100.373188,15.0105984 L98.1163168,15.0105984 C98.2026767,12.4158188 98.2544926,8.54953973 98.2544926,7.19173934 C97.7420908,7.87063953 97.2527182,8.53227955 96.7460737,9.18241279 C95.2568459,11.0771964 93.7752945,12.9662266 92.3014195,14.8495034 C92.2233056,14.9490731 92.1099904,15.0149569 91.9847667,15.0336119 C91.5241808,15.0336119 91.0578375,15.0336119 90.568465,15.0336119 L90.5742223,4.00436047 Z" id="Path"></path>
                                <path d="M115.561009,4.00436047 L117.789093,4.00436047 C117.743035,6.58187984 117.858181,9.14213905 117.714248,11.6793847 C117.714248,11.6793847 117.714248,11.6793847 117.760307,11.6448643 C119.487504,9.41830184 121.214701,7.2205063 122.901597,4.95367006 C123.363688,4.2707619 124.165543,3.89888437 124.985748,3.98710029 C125.110358,3.99521156 125.235364,3.99521156 125.359974,3.98710029 L125.359974,15.0105984 L123.103103,15.0105984 C123.189463,12.4158188 122.982199,9.83254603 123.241279,7.19749273 C122.728877,7.87639293 122.239505,8.53803295 121.73286,9.18816618 C120.258985,11.0791142 118.779353,12.9681444 117.293963,14.8552568 C117.215849,14.9548265 117.102534,15.0207103 116.97731,15.0393653 C116.516725,15.0393653 116.050381,15.0393653 115.561009,15.0393653 L115.561009,4.00436047 Z" id="Path"></path>
                                <path d="M25.7870545,9.55062984 C25.68918,11.8519864 24.8140667,13.7390988 22.6320409,14.8264898 C21.0228102,15.6240251 19.1281073,15.6002433 17.5394294,14.7625687 C15.9507514,13.9248941 14.8616361,12.3753749 14.6120885,10.5977471 C14.3034274,8.96317277 14.6711148,7.27338117 15.6311349,5.91448643 C16.7721032,4.28872461 18.7209397,3.42907489 20.6918227,3.68217054 C23.5205784,3.91847553 25.7090973,6.25976061 25.7525106,9.09611192 C25.7582679,9.23994671 25.7697825,9.37227471 25.7870545,9.55062984 Z M23.5359408,9.2457001 C23.4723301,8.78777088 23.3722181,8.3356508 23.23656,7.8936531 C22.8487113,6.57362815 21.6424122,5.66251321 20.2657807,5.64983043 C18.9832804,5.55732859 17.7782184,6.27069678 17.2431856,7.43913517 C16.5051892,8.79590022 16.5402262,10.4415168 17.3353028,11.7656856 C17.8011258,12.6027931 18.6172288,13.1877912 19.5600232,13.3604074 C20.5028177,13.5330236 21.4734513,13.2751591 22.2059989,12.6574612 C23.2135307,11.8404797 23.4898822,10.7185683 23.5359408,9.2457001 Z" id="Shape"></path>
                                <path d="M50.3247697,9.54487645 C50.2268952,11.8865068 49.33451,13.8138929 47.1006682,14.8610102 C45.4984668,15.6383045 43.6208306,15.6026508 42.049335,14.7650923 C40.4778393,13.9275338 39.4021917,12.3891787 39.155561,10.6265141 C38.8236149,8.98154081 39.1906424,7.27269463 40.16885,5.90873304 C41.3122369,4.28315761 43.2636173,3.42557993 45.2352952,3.68217054 C48.0549641,3.92961445 50.2306776,6.26784063 50.2729538,9.09611192 C50.2729538,9.2457001 50.3132551,9.3780281 50.3247697,9.54487645 Z M41.2627416,9.76350533 C41.3321513,10.2337154 41.4399818,10.6974546 41.5851518,11.1500727 C42.0110971,12.4662218 43.2238769,13.3688371 44.6077469,13.3996487 C45.8976526,13.4368154 47.0841892,12.6977203 47.6188274,11.5240431 C48.2229077,10.2655754 48.2229077,8.80116397 47.6188274,7.54269622 C47.2156535,6.63152035 46.4120116,5.95903084 45.443573,5.72243807 C44.4751344,5.4858453 43.4516593,5.71196404 42.673286,6.33448401 C41.6369677,7.13420543 41.3203149,8.26762355 41.2627416,9.76350533 L41.2627416,9.76350533 Z" id="Shape"></path>
                                <path d="M71.701714,9.55062984 C71.6038395,11.8519864 70.7344835,13.7390988 68.5467004,14.8207364 C66.9366775,15.6179585 65.0415062,15.5941178 63.4520754,14.7566475 C61.8626446,13.9191771 60.7722978,12.3699498 60.5209906,10.5919937 C60.2113448,8.95820903 60.576883,7.26874971 61.5342797,5.90873304 C62.675248,4.28297122 64.6240846,3.4233215 66.5949675,3.67641715 C69.4281583,3.91015029 71.6206565,6.2555169 71.6614127,9.09611192 C71.6729274,9.23419331 71.684442,9.36652132 71.701714,9.55062984 Z M62.6396859,9.75199855 C62.7142012,10.2207224 62.819988,10.6839442 62.9563387,11.1385659 C63.3879712,12.4796746 64.6336252,13.3913504 66.04334,13.3979322 C67.4530549,13.4044429 68.7071335,12.5043751 69.1512194,11.1673328 C69.4781112,10.2569319 69.5301631,9.27062192 69.3009098,8.33091085 C69.104984,7.25003747 68.3805474,6.33897198 67.3711706,5.90403339 C66.3617938,5.4690948 65.2015448,5.5680528 64.2805233,6.16763566 C63.0945145,6.96160368 62.7030165,8.15255572 62.6396859,9.75199855 Z" id="Shape"></path>
                                <path d="M151.601857,9.55638324 C151.503983,11.8980136 150.600083,13.8253997 148.366241,14.8667636 C146.762564,15.6396291 144.885717,15.599397 143.316679,14.7585211 C141.747641,13.9176451 140.67569,12.3775628 140.432649,10.6150073 C140.10734,8.99320105 140.461051,7.30901991 141.411394,5.95476017 C142.559233,4.28582217 144.550809,3.40647628 146.558442,3.68217054 C149.380383,3.9268357 151.559293,6.26582438 151.601857,9.09611192 C151.601857,9.23419331 151.601857,9.3780281 151.601857,9.55638324 Z M142.539829,9.75775194 C142.613853,10.2284613 142.719645,10.6936294 142.856482,11.1500727 C143.294378,12.4891105 144.544232,13.394942 145.953923,13.394942 C147.363613,13.394942 148.613467,12.4891105 149.051363,11.1500727 C149.378928,10.2398073 149.43099,9.25329775 149.201053,8.31365068 C149.002764,7.23296617 148.276105,6.32331312 147.26549,5.89065319 C146.254874,5.45799325 145.094594,5.55981934 144.174909,6.16188227 C143.01193,6.96735707 142.620432,8.15830911 142.557101,9.75775194 L142.539829,9.75775194 Z" id="Shape"></path>
                                <polygon id="Path" points="128.687708 4.00436047 130.904277 4.00436047 130.904277 8.21584302 135.596497 8.21584302 135.596497 4.01586725 137.841853 4.01586725 137.841853 15.0221051 135.608011 15.0221051 135.608011 10.2467902 130.933064 10.2467902 130.933064 15.0105984 128.687708 15.0105984"></polygon>
                                <path d="M103.240335,15.5571705 L102.157958,13.6355378 C102.319163,13.52047 102.457339,13.4111555 102.612787,13.3191013 C103.512876,12.7955031 104.095022,11.8603955 104.167264,10.8221294 C104.455131,8.61858043 104.881173,6.43229167 105.261156,4.24600291 C105.303455,4.12627347 105.402838,4.03559423 105.525993,4.00436047 C107.731048,4.00436047 109.94186,4.00436047 112.146916,4.00436047 C112.18847,4.01091984 112.22907,4.02251196 112.267819,4.03888081 L112.267819,15.0105984 L110.05125,15.0105984 L110.05125,5.91448643 L107.172588,5.91448643 C107.01714,6.83502907 106.855935,7.75557171 106.706244,8.67036095 C106.452922,10.1950097 106.216872,11.7196584 105.94052,13.2328004 C105.888249,13.4924632 105.747938,13.7261559 105.543265,13.8944404 C104.806327,14.4640262 104.029089,14.9875848 103.240335,15.5571705 Z" id="Path"></path>
                                <polygon id="Path" points="56.4735918 1.96190649 56.4735918 15.0105984 54.2224781 15.0105984 54.2224781 1.98492006 49.4554138 1.98492006 49.4554138 -5.5067062e-13 61.2867147 -5.5067062e-13 61.2867147 1.96190649"></polygon>
                            </g>
                            <g id="Group-2">
                                <polyline id="Path" fill="#AAAB22" points="28.6603276 17.7545821 35.5962882 11.1266751 31.8570283 8.48859368 26.2408065 16.2792914"></polyline>
                                <path d="M16.247451,21.3156286 C19.986277,22.2438535 23.920309,22.0362201 27.5385497,20.7196983 C28.6380764,20.2406375 29.6786486,19.6383624 30.6399358,18.9246402 C27.7228188,18.1742855 25.00892,16.7945201 22.6921755,14.8839425 C20.9985107,13.6121402 19.3928285,11.9769658 16.5993814,11.2066169 C14.0424954,10.504957 11.3010074,11.0946312 9.26749914,12.7836518 C9.67075266,16.0467332 11.950968,20.3490588 16.247451,21.3156286 Z" id="Path" fill="#FF5619"></path>
                                <path d="M29.8041013,17.4784193 L36.5201054,11.0612681 L31.7177225,7.66737275 L25.8522167,15.763303 C24.9124816,15.1902988 24.0067247,14.5642679 23.1394203,13.888303 C21.2430184,12.3007904 19.0365604,11.1181918 16.6580364,10.4144658 C13.9892313,9.68772159 9.13552526,8.79382624 6.60602589,11.388303 C4.95635239,13.0743495 4.72906404,15.8214425 5.93149273,19.5496402 C7.23656776,23.5903379 10.9098408,25.5089425 14.3484935,26.0394658 L12.1489289,29.9202797 L13.6153053,29.9202797 L15.7268874,26.1775472 L15.8075381,26.1775472 C16.2841104,26.1775472 16.7386871,26.1775472 17.1786001,26.1121402 L15.0743499,29.9420821 L16.5407263,29.9420821 L18.740291,25.9086518 C21.2961394,25.456907 23.6434603,24.2185484 25.4489632,22.3694076 C27.9010325,21.719689 30.2003788,20.5986399 32.2162905,19.069989 L33.1694352,18.2923728 L31.9670065,18.0380123 C31.2044908,17.8635937 30.4713026,17.6819076 29.8041013,17.4784193 Z M32.0036659,9.31708206 L34.6724711,11.1993495 L28.5503494,17.013303 C27.9637988,16.7880123 27.4359033,16.5554541 26.9446672,16.2865588 L32.0036659,9.31708206 Z M16.0274946,21.0976053 C13.0688267,20.2775555 10.8371418,17.8625944 10.271967,14.8694076 L9.10619773,15.1092332 C9.7538886,18.5371494 12.3141051,21.3004386 15.7048917,22.2313262 C18.1013805,22.9675621 20.6312159,23.1759088 23.1174247,22.8417914 C22.9194639,22.9798728 22.6995074,23.1179541 22.4648872,23.2560355 C20.463625,24.4175947 18.1853039,25.0273348 15.8661931,25.0220583 C12.4788636,24.8548728 8.40966892,23.2415007 7.11192576,19.2080704 C6.05613472,15.9304541 6.1881086,13.5830704 7.50784741,12.2240588 C8.40233704,11.3083611 9.86871348,10.8505123 11.7530072,10.8505123 C13.321267,10.8836028 14.8776883,11.1280944 16.3794249,11.5772565 C18.5922978,12.2415169 20.6437203,13.3497404 22.4062321,14.8330704 C24.7337763,16.7555562 27.4636241,18.1407554 30.3979837,18.888303 C28.1910872,20.2981867 22.6115248,23.1106867 16.0274946,21.0976053 Z" id="Shape" fill="#000000"></path>
                                <polyline id="Path" fill="#AAAB22" points="2.12624585 8.77202392 0.806507045 4.80400066 4.83171039 5.01475648"></polyline>
                                <ellipse id="Oval" fill="#FF5619" transform="translate(7.648619, 9.873705) rotate(-4.620000) translate(-7.648619, -9.873705) " cx="7.64861929" cy="9.87370545" rx="5.6305659" ry="5.58171788"></ellipse>
                                <ellipse id="Oval" stroke="#000000" stroke-width="1.4" fill="#FFFFFF" transform="translate(6.498894, 8.169847) rotate(-63.410000) translate(-6.498894, -8.169847) " cx="6.49889436" cy="8.16984717" rx="1.65265059" ry="1.66141712"></ellipse>
                                <ellipse id="Oval" fill="#AAAB22" transform="translate(13.096816, 1.732114) rotate(-63.410000) translate(-13.096816, -1.732114) " cx="13.0968161" cy="1.73211431" rx="1.16486385" ry="1.1710429"></ellipse>
                                <ellipse id="Oval" fill="#AAAB22" transform="translate(15.373056, 5.003693) rotate(-22.480000) translate(-15.373056, -5.003693) " cx="15.3730559" cy="5.00369326" rx="1.17159956" ry="1.16430391"></ellipse>
                                <path d="M17.0099668,4.3243495 C16.7127184,3.4407099 15.769706,2.94226681 14.8638176,3.18997068 C13.9579292,3.43767454 13.4061145,4.34485939 13.6079734,5.25458206 C12.9883998,5.39963922 12.3432533,5.39963922 11.7236797,5.25458206 L11.6796884,5.21097741 C12.2880002,4.7852912 12.7631405,4.19847482 13.0507504,3.51766345 L13.0507504,3.51766345 C13.9104636,3.51832501 14.6469683,2.90797277 14.7986201,2.06917809 C14.9502719,1.23038341 14.4734346,0.404501341 13.6669918,0.10919823 C12.8605489,-0.18610488 11.9565467,0.134141581 11.5216174,0.869205785 C11.0866882,1.60426999 11.2459786,2.54264433 11.8996449,3.09615182 C11.6476617,3.66854195 11.2189505,4.14692115 10.6752205,4.46243089 C8.83711898,3.46518058 6.61616559,3.45152405 4.76572345,4.42609368 L-6.03961325e-14,4.17900066 L1.54702715,8.83016345 C1.45736186,9.34108084 1.43272984,9.86113158 1.47370833,10.3781286 C1.73328449,13.5802536 4.42822232,16.0491858 7.66914881,16.0540007 L8.18238057,16.0540007 C10.3640595,15.86822 12.2873102,14.5611466 13.2485165,12.6109697 C14.2097228,10.6607928 14.0678437,8.35366837 12.8747852,6.53365182 C13.3234119,6.52890648 13.7685947,6.45536147 14.194524,6.31562857 C14.8119418,6.85887161 15.7265731,6.90593438 16.3974208,6.42897963 C17.0682684,5.95202487 17.316506,5.07819337 16.995303,4.3243495 L17.0099668,4.3243495 Z M12.6108374,1.47551229 C12.7159044,1.22181125 12.9873193,1.07718696 13.2587647,1.13026216 C13.5302101,1.18333736 13.7258858,1.41929097 13.7258858,1.69353555 C13.7258858,1.96778012 13.5302101,2.20373373 13.2587647,2.25680893 C12.9873193,2.30988413 12.7159044,2.16525984 12.6108374,1.9115588 C12.545427,1.77778589 12.5349138,1.62407957 12.5815099,1.48277973 L12.6108374,1.47551229 Z M1.6496735,5.44353555 L3.24069195,5.52347741 C3.13071371,5.63975648 3.0134036,5.7487681 2.91075725,5.87231462 C2.62785443,6.2113481 2.38207986,6.57920591 2.17756902,6.96969834 L1.6496735,5.44353555 Z M8.05773857,14.8476053 C6.23623784,15.0435078 4.45107365,14.2435756 3.39612838,12.7587374 C2.34118311,11.2738992 2.18285616,9.33836253 2.98268825,7.70445872 C3.78252034,6.0705549 5.41435176,4.99600402 7.24389964,4.89847741 L7.65448505,4.89847741 C10.3321969,4.93494192 12.512995,7.04186971 12.6183911,9.69424091 C12.7237872,12.3466121 10.7169298,14.6170307 8.05040669,14.8621402 L8.05773857,14.8476053 Z M15.5949135,5.53074485 C15.4102047,5.60552725 15.1996688,5.58081451 15.0376905,5.46533787 L14.8397296,5.21824485 C14.7664321,5.04125648 14.7868948,4.83970643 14.8943004,4.68074319 C15.0017061,4.52177995 15.1819406,4.42629258 15.374957,4.42609368 C15.6510622,4.42678216 15.8882931,4.62054996 15.9417564,4.88904965 C15.9952196,5.15754934 15.8500503,5.42612751 15.5949135,5.53074485 L15.5949135,5.53074485 Z" id="Shape" fill="#000307"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>`
}
