import { resolve } from 'path';
const fs         = require('fs');
const fileExists = require('file-exists');
const pdf        = require('html-pdf');
const path       = require("path");
const ObjectId   = require('mongodb').ObjectID;

const rootPath = (process.env.NODE_ENV === 'development')
? resolve(__dirname, '..', '..')
: __dirname;
const customPath = resolve(__dirname, '..', '..', '..');

const options = {
    format: 'A4',
    orientation: 'landscape',
    base: `${customPath}/src`,
    script: `${customPath}/src/assets/html-pdf/pdf_a4_portrait.js`,
    quality: '100',
    phantomPath:  process.env.PHANTOM_PATH || null ,
};

export class PDFGeneratorModel {

    collection: any;

    constructor(public db: any) {
        this.collection = db.collection('addresses');
    }

    public async convert (html) {
        return new Promise((resolve, reject) => {
            pdf.create(html, options).toFile(`pdf/businesscard.pdf`, (err, file) => {
                if (err) { reject(err); }
                resolve(file); // { filename: '/app/businesscard.pdf' }
            });
        });
    }

    public async create(req, res) {

        console.log(customPath);
        
        let collection = this.collection;
        // console.log('FLAT', this.collection.findOne({ _id: req.params.id}));
        
        return await this.collection.findOne({ _id: ObjectId(req.params.id)}, (err, result) => {
            // if (err) { return res.status(500).json({ error: err }); }
            console.log(result);
            if (result) {
                let flatInfo = {
                    section: result.section,
                    decoration: result.decorationName,
                    floor: result.floor,
                    flat: result.flat,
                    price: String(result.price).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '),
                    space: String(result.space),
                    rooms: (result.rooms == '0')
                        ? 'Квартира-студия'
                        : (result.rooms == '1') ? '1-комн. квартира'
                        : (result.rooms == '2') ? '2-комн. квартира'
                        : '3-комн. квартира'
                };

                let pathSVGFloor = `${rootPath}/assets/floor-plans/section_${result.section}/floor_${result.floor}/sect_${result.section}_fl_${result.floor}.svg`;
                let pathSVGFlat = `${rootPath}/assets/floor-plans/section_${result.section}/floor_${result.floor}/${result.floor}floor_${result.flat}flat.svg`;

                let svgFloor = '';
                let svgFlat = '';

                fileExists(pathSVGFloor, (err, exists) => {
                    // if (err) { return res.status(500).json({err: err}); }
                    console.log('2');

                    if (exists) {
                        let id ;
                        id =  `_${flatInfo.flat}`;
                        svgFloor = fs.readFileSync(pathSVGFloor, 'utf8').replace(/cls|st(?=\d)/g, "floorst").replace(
                            `id="${id}"`,
                            `id="${id}" class="active-flat" `
                        );
                    }

                    fileExists(pathSVGFlat, (err, exist) => {
                        // if (err) { return res.status(500).json({err: err}); }
                        console.log('3');

                        if (exist) {
                            svgFlat = fs.readFileSync(pathSVGFlat, 'utf8').replace(/cls|st(?=\d)/g, "roomst");
                        }

                        let phoneCollection = this.db.collection('contacts');
                        phoneCollection.findOne({_id : 'phone'}, (err, result) => {

                            // if (err) { return res.status(500).json({ error: err }); }

                            let phoneNumber = result.phone;

                            let html = this.htmlRender(svgFloor, svgFlat, phoneNumber, flatInfo);
                            console.log((new Date()), 'pdf request', flatInfo);
                            this.convert(html).then((file: any) => {
                                console.log(file.filename);
                                fs.open( file.filename , (err, data) => {
                                    // res.contentType('application/pdf');
                                    // res.send(data);
                                    if (err) {
                                        console.error(err)
                                        return
                                      }
                                      console.log(data)
                                });
                            }).catch((err) => {
                                console.log(err);
                                // res.status(500).json({err});
                            });
                        });
                    });

                });
            } else {
                console.log('0');
                // return res.status(404).json({message: 'page not found'})
            }
        });
    }

    public style = `
        @font-face {
            font-family: "abrade-book";
            src: url("file:///${rootPath}/assets/fonts/abrade-book/abrade-book.eot");
            src: url("file:///${rootPath}/assets/fonts/abrade-book/abrade-book.eot") format('embedded-opentype'),
                url("file:///${rootPath}/assets/fonts/abrade-book/abrade-book.ttf") format("truetype"),
                url("file:///${rootPath}/assets/fonts/abrade-book/abrade-book.woff") format("woff"),
                url("file:///${rootPath}/assets/fonts/abrade-book/abrade-book.woff2") format("woff2");
            font-style: normal;
            font-weight: normal;
        }
        
        @font-face {
            font-family: 'LeksaSans';
            src: url('file:///${rootPath}/assets/fonts/leksa-sans/LeksaSans.eot');
            src: url('file:///${rootPath}/assets/fonts/leksa-sans/LeksaSans.eot') format('embedded-opentype'),
                url('file:///${rootPath}/assets/fonts/leksa-sans/LeksaSans.woff2') format('woff2'),
                url('file:///${rootPath}/assets/fonts/leksa-sans/LeksaSans.woff') format('woff'),
                url('file:///${rootPath}/assets/fonts/leksa-sans/LeksaSans.ttf') format('truetype'),
                url('file:///${rootPath}/assets/fonts/leksa-sans/LeksaSans.svg#LeksaSans') format('svg');
            font-style: normal;
            font-weight: normal;
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
            width: 20mm;
            border-radius: 50%;
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
            left: 43mm;
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

        .active-flat * {
            fill: #83d6f4 !important;
        }

        .pdf-generate__side-menu-content-gkplan {
            margin-top: -5mm;
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
    `;

    public htmlRender (svgFloor, svgFlat, phoneNumber, addr) {
        return `
            <html>
  
              <head>
                <meta charset="UTF-8">
                <title>ГК &#171;МАЙ&#187;</title>
                
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
                            <div class="pdf-generate__header-addr-item">г. Люберцы, ул. Инициативная, 5</div>
                            <div class="pdf-generate__header-addr-item">${phoneNumber}</div>
                            <div class="pdf-generate__header-addr-item">oblakadom.ru</div>
                        </div>
                    </div>
                    <div class="pdf-generate__side-menu">
                        <div class="pdf-generate__side-menu-content side-menu-content-plan">

                            <div class="pdf-generate__side-menu-content-addr">
                                <div class="pdf-generate__side-menu-content-addr-flat">Кв. №${addr.flat}</div>
                                <div class="pdf-generate__side-menu-content-addr-other">
                                    <div class="pdf-generate__side-menu-content-addr-other-item">Секция ${addr.section}</div>
                                    <div class="pdf-generate__side-menu-content-addr-other-item">Этаж ${addr.floor}</div>
                                </div>
                            </div>

                            <div class="pdf-generate__side-menu-content-gkplan">${this.gkPlan(addr.section)}</div>
                            
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
                            <div class="pdf-generate__header-addr-item">г. Люберцы, ул. Инициативная, 5</div>
                            <div class="pdf-generate__header-addr-item">${phoneNumber}</div>
                            <div class="pdf-generate__header-addr-item">oblakadom.ru</div>
                        </div>
                    </div>
                    <div class="pdf-generate__side-menu">
                        <div class="pdf-generate__side-menu-content side-menu-content-info">
                            <div class="pdf-generate__side-menu-content-addr">
                                <div class="pdf-generate__side-menu-content-addr-flat">Кв. №${addr.flat}</div>
                                <div class="pdf-generate__side-menu-content-addr-other">
                                    <div class="pdf-generate__side-menu-content-addr-other-item">Секция ${addr.section}</div>
                                    <div class="pdf-generate__side-menu-content-addr-other-item">Этаж ${addr.floor}</div>
                                </div>
                            </div>

                            <div class="pdf-generate__side-menu-content-info">
                                <div class="pdf-generate__side-menu-content-info-room">${addr.rooms}</div>
                                <div class="pdf-generate__side-menu-content-info-space">${addr.space} м<sup>2</sup></div>
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

    public gkPlan(section) {
        return `

        <svg class="flats_aside_scheme" viewBox="0 0 170.7 176">

            <style type="text/css">
                #_x3${section}_ * {fill: #83d6f4 !important;}
            </style>
        
            <g id="_x36_">
                <polyline class="flats_aside_scheme_section" points="144.9,109 134.5,120.1 147.3,132 170,107.4 157.2,95.9 144.9,109 	"/>
                <text transform="matrix(1 0 0 1 148.2101 118.2705)" class="flats_aside_scheme_count">6</text>
            </g>
            <g id="_x35_">
                <polygon class="flats_aside_scheme_section" points="157.2,95.9 136.6,76.6 124,89.4 144.9,109 	"/>
                <text transform="matrix(1 0 0 1 136.2355 96.8418)" class="flats_aside_scheme_count">5</text>
            </g>
            <g id="_x34_">
                <polygon class="flats_aside_scheme_section" points="124,89.4 139.7,73.4 116.7,51.8 101.3,68.1 	"/>
                <text transform="matrix(1 0 0 1 115.1759 74.392)" class="flats_aside_scheme_count">4</text>
            </g>
            <g id="_x33_">
                <polygon class="flats_aside_scheme_section" points="88.9,57.7 103.4,42.2 115.3,53.4 128.4,39.5 99.7,12.5 98.2,11.1 88.4,21.5 85.1,25.1 85.1,25.1 
                    70.6,40.5 	"/>
                <text transform="matrix(1 0 0 1 91.6999 38.2334)" class="flats_aside_scheme_count">3</text>
            </g>
            <g id="_x32_">
                <polygon class="flats_aside_scheme_section" points="88.9,57.7 70.6,40.5 43.8,69.1 62.1,86.2 	"/>
                <text transform="matrix(1 0 0 1 63.3405 67.3653)" class="flats_aside_scheme_count">2</text>
            </g>
            <g id="_x31_">
                <polygon class="flats_aside_scheme_section" points="62.1,86.2 43.8,69.1 15.4,99.4 33.7,116.5 	"/>
                <text transform="matrix(1 0 0 1 36.1178 96.8418)" class="flats_aside_scheme_count">1</text>
            </g>
        
            <g>
                <g>
                    <g>
                        <defs>
                            <polygon id="SVGID_1_" points="85.8,143.7 99.9,128.2 116.1,142.9 91.5,169.8 80.9,160.2 85.8,154.8 80.3,149.6 75.3,155.1 43.9,126.4 54.4,115"/>
                        </defs>
                        <clipPath id="SVGID_2_">
                            <use xlink:href="#SVGID_1_"  style="overflow:visible;"/>
                        </clipPath>
                        <g class="flats_aside_scheme_clip-path">
                            <line class="flats_aside_scheme_figure" x1="40.8" y1="131" x2="83.1" y2="84.8"/>
                            <line class="flats_aside_scheme_figure" x1="42.8" y1="132.9" x2="85" y2="86.7"/>
                            <line class="flats_aside_scheme_figure" x1="44.7" y1="134.8" x2="87" y2="88.5"/>
                            <line class="flats_aside_scheme_figure" x1="46.6" y1="136.6" x2="88.9" y2="90.4"/>
                            <line class="flats_aside_scheme_figure" x1="48.6" y1="138.5" x2="90.8" y2="92.3"/>
                            <line class="flats_aside_scheme_figure" x1="50.5" y1="140.4" x2="92.8" y2="94.1"/>
                            <line class="flats_aside_scheme_figure" x1="52.4" y1="142.2" x2="94.7" y2="96"/>
                            <line class="flats_aside_scheme_figure" x1="54.4" y1="144.1" x2="96.6" y2="97.9"/>
                            <line class="flats_aside_scheme_figure" x1="56.3" y1="146" x2="98.6" y2="99.7"/>
                            <line class="flats_aside_scheme_figure" x1="58.2" y1="147.8" x2="100.5" y2="101.6"/>
                            <line class="flats_aside_scheme_figure" x1="60.2" y1="149.7" x2="102.4" y2="103.5"/>
                            <line class="flats_aside_scheme_figure" x1="62.1" y1="151.6" x2="104.4" y2="105.3"/>
                            <line class="flats_aside_scheme_figure" x1="64.1" y1="153.4" x2="106.3" y2="107.2"/>
                            <line class="flats_aside_scheme_figure" x1="66" y1="155.3" x2="108.2" y2="109.1"/>
                            <line class="flats_aside_scheme_figure" x1="67.9" y1="157.2" x2="110.2" y2="110.9"/>
                            <line class="flats_aside_scheme_figure" x1="69.9" y1="159" x2="112.1" y2="112.8"/>
                            <line class="flats_aside_scheme_figure" x1="71.8" y1="160.9" x2="114.1" y2="114.7"/>
                            <line class="flats_aside_scheme_figure" x1="73.7" y1="162.8" x2="116" y2="116.5"/>
                            <line class="flats_aside_scheme_figure" x1="75.7" y1="164.6" x2="117.9" y2="118.4"/>
                            <line class="flats_aside_scheme_figure" x1="77.6" y1="166.5" x2="119.9" y2="120.3"/>
                            <line class="flats_aside_scheme_figure" x1="79.5" y1="168.4" x2="121.8" y2="122.1"/>
                            <line class="flats_aside_scheme_figure" x1="81.5" y1="170.2" x2="123.7" y2="124"/>
                            <line class="flats_aside_scheme_figure" x1="83.4" y1="172.1" x2="125.7" y2="125.9"/>
                            <line class="flats_aside_scheme_figure" x1="85.3" y1="174" x2="127.6" y2="127.7"/>
                            <line class="flats_aside_scheme_figure" x1="87.3" y1="175.8" x2="129.5" y2="129.6"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            <path class="flats_aside_scheme_fill" d="M0,118.2l3.1-1.4l1.4-5l0.6,0.5l-1.2,4.1l3.9-1.8l0.6,0.5l-7.8,3.5L0,118.2z"/>
                            <path class="flats_aside_scheme_fill" d="M8.4,121.8l2.8-3.2l-1.5-1.3l-0.6,0.5c-0.7,0.6-1.3,1-1.7,1.3c-0.5,0.3-0.9,0.4-1.3,0.4
                                c-0.4,0-0.7-0.2-1.1-0.5l0.5-0.5c0.2,0.2,0.5,0.2,0.8,0.2c0.3,0,0.6-0.2,1-0.4c0.4-0.2,0.8-0.6,1.4-1.1l1-0.9l2.6,2.3L9,122.3
                                L8.4,121.8z"/>
                            <path class="flats_aside_scheme_fill" d="M11.5,123.9c-0.1,0.1-0.2,0.2-0.4,0.2s-0.3,0-0.4-0.1c-0.1-0.1-0.2-0.2-0.2-0.4c0-0.2,0-0.3,0.1-0.4
                                c0.1-0.1,0.2-0.2,0.4-0.2c0.2,0,0.3,0,0.4,0.1c0.1,0.1,0.2,0.2,0.2,0.4C11.6,123.6,11.6,123.8,11.5,123.9z"/>
                            <path class="flats_aside_scheme_fill" d="M18.7,130.8l4.3-5l-7.8,2l-0.6-0.5l5.1-5.9l0.6,0.5l-4.3,4.9l7.7-1.9l0.7,0.6l-5.1,5.9L18.7,130.8z"/>
                            <path class="flats_aside_scheme_fill" d="M23.6,135.1l1.4-1.7l-2.4-2.1l-1.4,1.7l-0.6-0.5l3.3-3.8l0.6,0.5l-1.4,1.6l2.4,2.1l1.4-1.6l0.6,0.5
                                l-3.3,3.8L23.6,135.1z"/>
                            <path class="flats_aside_scheme_fill" d="M28.5,139.3l2.6-3l-5,0.8l-0.6-0.5l3.3-3.8l0.6,0.5l-2.6,2.9l5-0.8l0.6,0.5l-3.3,3.8L28.5,139.3z"/>
                            <path class="flats_aside_scheme_fill" d="M34.9,143.9l-1.6,1.8l-0.6-0.5l1.1-1.3l-3.5-3l3.3-3.8l0.6,0.5l-2.8,3.2l2.3,2l2.8-3.2l0.6,0.5l-2.8,3.2
                                L34.9,143.9z"/>
                            <path class="flats_aside_scheme_fill" d="M38.5,148l2.6-3l-5,0.8l-0.6-0.5l3.3-3.8l0.6,0.5l-2.6,2.9l5-0.8l0.6,0.5l-3.3,3.8L38.5,148z"/>
                            <path class="flats_aside_scheme_fill" d="M43.6,152.4l-0.6-0.5l0.6-0.7c-0.4,0.1-0.7,0.1-1.1,0c-0.4-0.1-0.7-0.2-1-0.5c-0.3-0.3-0.5-0.6-0.7-0.9
                                c-0.1-0.3-0.2-0.6-0.1-0.9c0-0.3,0.2-0.6,0.3-0.8c0.2-0.2,0.4-0.4,0.7-0.5c0.3-0.1,0.6-0.1,1,0s0.8,0.3,1.2,0.7
                                c0.2,0.2,0.4,0.4,0.6,0.6c0.2,0.2,0.3,0.4,0.4,0.6c0.3-0.4,0.5-0.8,0.5-1.1c0-0.3-0.2-0.7-0.6-1c-0.2-0.2-0.5-0.4-0.8-0.5
                                c-0.3-0.1-0.5-0.2-0.7-0.3l0.3-0.6c0.3,0.1,0.6,0.2,0.9,0.3c0.3,0.2,0.6,0.4,0.9,0.6c1.1,1,1.2,2.1,0.2,3.2L43.6,152.4z
                                    M41.6,148.7c-0.2,0.2-0.2,0.4-0.2,0.7c0.1,0.3,0.2,0.6,0.6,0.8c0.2,0.2,0.5,0.3,0.8,0.4c0.3,0.1,0.6,0.1,0.9,0
                                c0.3-0.1,0.5-0.2,0.7-0.4l0.1-0.1c-0.1-0.1-0.2-0.3-0.4-0.6c-0.2-0.2-0.4-0.4-0.6-0.6c-0.4-0.4-0.8-0.5-1.1-0.5
                                C42.1,148.4,41.8,148.5,41.6,148.7z"/>
                            <path class="flats_aside_scheme_fill" d="M49.2,151.6l-2.8,3.3l-0.6-0.5l2.8-3.3l-1.5-1.3l0.5-0.5l3.5,3.1l-0.5,0.5L49.2,151.6z"/>
                            <path class="flats_aside_scheme_fill" d="M51.7,159.5l2.6-3l-5,0.8l-0.6-0.5l3.3-3.8l0.6,0.5l-2.6,2.9l5-0.8l0.6,0.5l-3.3,3.8L51.7,159.5z"/>
                            <path class="flats_aside_scheme_fill" d="M59.3,161.3c-0.2,0.2-0.4,0.3-0.6,0.3c-0.2,0-0.5,0-0.7-0.1c0.2,0.3,0.3,0.6,0.3,0.8c0,0.3-0.1,0.5-0.3,0.8
                                c-0.3,0.3-0.6,0.5-1,0.5c-0.4,0-0.8-0.2-1.1-0.5l-2.3-2l3.3-3.8l2.2,1.9c0.4,0.3,0.6,0.6,0.6,1C59.7,160.6,59.6,161,59.3,161.3z
                                    M54.6,161.1l1.6,1.4c0.5,0.4,0.9,0.5,1.2,0.1c0.2-0.2,0.2-0.4,0.2-0.6c0-0.2-0.2-0.4-0.4-0.6l-1.6-1.4L54.6,161.1z M56,159.4
                                l1.5,1.3c0.2,0.2,0.5,0.3,0.7,0.3c0.2,0,0.4-0.1,0.5-0.2c0.2-0.2,0.2-0.4,0.2-0.6c-0.1-0.2-0.2-0.4-0.4-0.6l-1.5-1.3L56,159.4z"
                                />
                            <path class="flats_aside_scheme_fill" d="M61,167.6l1.4-1.7l-2.4-2.1l-1.4,1.7L58,165l3.3-3.8l0.6,0.5l-1.4,1.6l2.4,2.1l1.4-1.6l0.6,0.5l-3.3,3.8
                                L61,167.6z"/>
                            <path class="flats_aside_scheme_fill" d="M66.1,172l-0.6-0.5l0.6-0.7c-0.4,0.1-0.7,0.1-1.1,0c-0.4-0.1-0.7-0.2-1-0.5c-0.3-0.3-0.5-0.6-0.7-0.9
                                c-0.1-0.3-0.2-0.6-0.1-0.9c0-0.3,0.2-0.6,0.3-0.8c0.2-0.2,0.4-0.4,0.7-0.5c0.3-0.1,0.6-0.1,1,0c0.4,0.1,0.8,0.3,1.2,0.7
                                c0.2,0.2,0.4,0.4,0.6,0.6c0.2,0.2,0.3,0.4,0.4,0.6c0.3-0.4,0.5-0.8,0.5-1.1c0-0.3-0.2-0.7-0.6-1c-0.2-0.2-0.5-0.4-0.8-0.5
                                c-0.3-0.1-0.5-0.2-0.7-0.3l0.3-0.6c0.3,0.1,0.6,0.2,0.9,0.3c0.3,0.2,0.6,0.4,0.9,0.6c1.1,1,1.2,2.1,0.2,3.2L66.1,172z
                                    M64.2,168.3c-0.2,0.2-0.2,0.4-0.2,0.7c0.1,0.3,0.2,0.6,0.6,0.8c0.2,0.2,0.5,0.3,0.8,0.4c0.3,0.1,0.6,0.1,0.9,0
                                c0.3-0.1,0.5-0.2,0.7-0.4l0.1-0.1c-0.1-0.1-0.2-0.3-0.4-0.6c-0.2-0.2-0.4-0.4-0.6-0.6c-0.4-0.4-0.8-0.5-1.1-0.5
                                C64.6,168,64.4,168.1,64.2,168.3z"/>
                            <path class="flats_aside_scheme_fill" d="M70.1,175.4l1.3-1.5l-1.2-1l-2.3,0.6l-0.7-0.6l2.4-0.5c-0.2-0.3-0.3-0.6-0.3-1c0-0.3,0.1-0.7,0.4-0.9
                                c0.3-0.3,0.7-0.5,1.1-0.5c0.4,0,0.8,0.2,1.2,0.5l2,1.8l-3.3,3.8L70.1,175.4z M70.8,170.6c-0.2,0-0.4,0.1-0.6,0.3
                                c-0.2,0.2-0.2,0.4-0.2,0.6c0,0.2,0.2,0.4,0.4,0.6l1.4,1.2l1.1-1.3l-1.4-1.2C71.2,170.7,71,170.6,70.8,170.6z"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            <path class="flats_aside_scheme_fill" d="M11.3,84.4l-0.8,0.8L5,85.5l2.9,2.7l-0.5,0.6l-5.7-5.3l0.5-0.6l2.7,2.5L4.7,80l0.7-0.8l0.1,5.5L11.3,84.4z"
                                />
                            <path class="flats_aside_scheme_fill" d="M12,78.1c0.5,0.1,0.9,0.3,1.2,0.6c0.3,0.3,0.6,0.7,0.7,1.2c0.1,0.5,0.1,0.9,0,1.4c-0.1,0.5-0.3,0.9-0.7,1.2
                                c-0.3,0.3-0.7,0.6-1.2,0.7c-0.5,0.1-0.9,0.2-1.4,0.1c-0.5-0.1-0.9-0.3-1.2-0.6c-0.3-0.3-0.6-0.7-0.7-1.2c-0.1-0.5-0.1-0.9,0-1.4
                                c0.1-0.5,0.3-0.9,0.6-1.2c0.3-0.4,0.7-0.6,1.2-0.7C11,78,11.5,78,12,78.1z M9.5,81.2c0.1,0.3,0.3,0.6,0.5,0.9
                                c0.3,0.2,0.6,0.4,0.9,0.5c0.3,0.1,0.7,0.1,1,0c0.3-0.1,0.6-0.3,0.8-0.5c0.2-0.2,0.4-0.5,0.4-0.9c0.1-0.3,0.1-0.7,0-1
                                c-0.1-0.3-0.3-0.6-0.5-0.8c-0.3-0.2-0.6-0.4-0.9-0.5c-0.3-0.1-0.7-0.1-1,0c-0.3,0.1-0.6,0.3-0.8,0.5c-0.2,0.2-0.4,0.5-0.4,0.9
                                C9.4,80.6,9.4,80.9,9.5,81.2z"/>
                            <path class="flats_aside_scheme_fill" d="M19.7,75.4L16.5,73l1.8,4l-0.6,0.6l-4.1-1.5l2.6,3l-0.5,0.5l-3.3-3.8l0.6-0.7l4.4,1.6l-1.9-4.3l0.6-0.7l4,3
                                L19.7,75.4z"/>
                            <path class="flats_aside_scheme_fill" d="M21.1,67.6l0.1,0.7c-0.3,0-0.6,0.1-0.9,0.2c-0.3,0.1-0.5,0.3-0.7,0.5c-0.2,0.3-0.4,0.6-0.5,0.9
                                c-0.1,0.3-0.1,0.7,0,1c0.1,0.3,0.3,0.6,0.5,0.8c0.3,0.2,0.5,0.4,0.9,0.5c0.3,0.1,0.7,0.1,1,0c0.3-0.1,0.6-0.3,0.9-0.5
                                c0.4-0.4,0.6-1,0.6-1.7l0.7,0.1c0,0.4-0.1,0.8-0.2,1.1c-0.1,0.3-0.3,0.7-0.6,1c-0.4,0.4-0.8,0.6-1.2,0.8
                                c-0.5,0.1-0.9,0.2-1.4,0.1c-0.5-0.1-0.9-0.3-1.2-0.6c-0.3-0.3-0.6-0.7-0.7-1.2c-0.1-0.5-0.1-0.9,0-1.4c0.1-0.5,0.3-0.9,0.7-1.3
                                c0.3-0.3,0.6-0.5,0.9-0.7C20.4,67.7,20.7,67.6,21.1,67.6z"/>
                            <path class="flats_aside_scheme_fill" d="M25.4,63.6c0.5,0.1,0.9,0.3,1.2,0.6c0.3,0.3,0.6,0.7,0.7,1.2c0.1,0.5,0.1,0.9,0,1.4
                                c-0.1,0.5-0.3,0.9-0.7,1.2c-0.3,0.3-0.7,0.6-1.2,0.7c-0.5,0.1-0.9,0.2-1.4,0.1c-0.5-0.1-0.9-0.3-1.2-0.6
                                c-0.3-0.3-0.6-0.7-0.7-1.2c-0.1-0.5-0.1-0.9,0-1.4c0.1-0.5,0.3-0.9,0.6-1.2c0.3-0.4,0.7-0.6,1.2-0.7
                                C24.5,63.6,25,63.5,25.4,63.6z M23,66.8c0.1,0.3,0.3,0.6,0.5,0.9c0.3,0.2,0.6,0.4,0.9,0.5c0.3,0.1,0.7,0.1,1,0
                                c0.3-0.1,0.6-0.3,0.8-0.5c0.2-0.2,0.4-0.5,0.4-0.9c0.1-0.3,0.1-0.7,0-1c-0.1-0.3-0.3-0.6-0.5-0.8c-0.3-0.2-0.6-0.4-0.9-0.5
                                c-0.3-0.1-0.7-0.1-1,0c-0.3,0.1-0.6,0.3-0.8,0.5c-0.2,0.2-0.4,0.5-0.4,0.9C22.9,66.1,22.9,66.4,23,66.8z"/>
                            <path class="flats_aside_scheme_fill" d="M33.2,60.9L30,58.5l1.8,4l-0.6,0.6l-4.1-1.5l2.6,3l-0.5,0.5l-3.3-3.8l0.6-0.7l4.4,1.6L29.1,58l0.6-0.7l4,3
                                L33.2,60.9z"/>
                            <path class="flats_aside_scheme_fill" d="M35.1,53.3c0.5,0.1,0.9,0.3,1.2,0.6c0.3,0.3,0.6,0.7,0.7,1.2c0.1,0.5,0.1,0.9,0,1.4
                                c-0.1,0.5-0.3,0.9-0.7,1.2c-0.3,0.3-0.7,0.6-1.2,0.7c-0.5,0.1-0.9,0.2-1.4,0.1c-0.5-0.1-0.9-0.3-1.2-0.6
                                c-0.3-0.3-0.6-0.7-0.7-1.2c-0.1-0.5-0.1-0.9,0-1.4c0.1-0.5,0.3-0.9,0.6-1.2c0.3-0.4,0.7-0.6,1.2-0.7
                                C34.1,53.2,34.6,53.2,35.1,53.3z M32.6,56.4c0.1,0.3,0.3,0.6,0.5,0.9c0.3,0.2,0.6,0.4,0.9,0.5c0.3,0.1,0.7,0.1,1,0
                                c0.3-0.1,0.6-0.3,0.8-0.5c0.2-0.2,0.4-0.5,0.4-0.9c0.1-0.3,0.1-0.7,0-1c-0.1-0.3-0.3-0.6-0.5-0.8c-0.3-0.2-0.6-0.4-0.9-0.5
                                c-0.3-0.1-0.7-0.1-1,0c-0.3,0.1-0.6,0.3-0.8,0.5c-0.2,0.2-0.4,0.5-0.4,0.9C32.5,55.8,32.5,56.1,32.6,56.4z"/>
                            <path class="flats_aside_scheme_fill" d="M41.5,52.1l-3.1-2.9L37,50.6l0.5,0.6c0.6,0.7,1,1.3,1.2,1.8c0.3,0.5,0.4,0.9,0.3,1.3c0,0.4-0.2,0.7-0.5,1.1
                                L38,54.8c0.2-0.2,0.3-0.5,0.2-0.8c0-0.3-0.2-0.6-0.4-1c-0.2-0.4-0.6-0.9-1.1-1.4l-0.8-1l2.3-2.5l3.7,3.4L41.5,52.1z"/>
                            <path class="flats_aside_scheme_fill" d="M42.2,46.2c0.5-0.5,1-0.8,1.4-0.9c0.5-0.1,0.9,0.1,1.3,0.5c0.4,0.4,0.6,0.8,0.6,1.3c0,0.5-0.3,1-0.8,1.5
                                l-1.6,1.8l-3.7-3.4l0.5-0.6l1.1,1L42.2,46.2z M43.1,49.3l1.1-1.2c0.6-0.7,0.7-1.2,0.2-1.7c-0.3-0.2-0.5-0.3-0.8-0.3
                                c-0.3,0-0.6,0.2-0.9,0.6l-1.1,1.2L43.1,49.3z"/>
                            <path class="flats_aside_scheme_fill" d="M47,39.9l0.1,0.7c-0.3,0-0.6,0.1-0.9,0.2c-0.3,0.1-0.5,0.3-0.7,0.5c-0.2,0.3-0.4,0.6-0.5,0.9
                                c-0.1,0.3-0.1,0.7,0,1c0.1,0.3,0.3,0.6,0.5,0.8c0.3,0.2,0.5,0.4,0.9,0.5c0.3,0.1,0.7,0.1,1,0c0.3-0.1,0.6-0.3,0.9-0.5
                                c0.4-0.4,0.6-1,0.6-1.7l0.7,0.1c0,0.4-0.1,0.8-0.2,1.1c-0.1,0.3-0.3,0.7-0.6,1c-0.4,0.4-0.8,0.6-1.2,0.8
                                c-0.5,0.1-0.9,0.2-1.4,0.1c-0.5-0.1-0.9-0.3-1.2-0.6c-0.3-0.3-0.6-0.7-0.7-1.2c-0.1-0.5-0.1-0.9,0-1.4c0.1-0.5,0.3-0.9,0.7-1.3
                                c0.3-0.3,0.6-0.5,0.9-0.7C46.2,40,46.6,39.9,47,39.9z"/>
                            <path class="flats_aside_scheme_fill" d="M54.1,38.5l-0.8,0.9l-3.6,0.3l1.8,1.7L51,41.9l-3.7-3.4l0.5-0.6l1.7,1.6l0.1-3.5l0.8-0.8l-0.1,3.7
                                L54.1,38.5z"/>
                            <path class="flats_aside_scheme_fill" d="M57.6,34.7l-2.9-2.7l0.6,5.1l-0.5,0.6l-3.7-3.4l0.5-0.6l2.8,2.7l-0.6-5.1l0.5-0.6l3.7,3.4L57.6,34.7z"/>
                            <path class="flats_aside_scheme_fill" d="M57,26.3c-0.1,0.3-0.2,0.6-0.5,0.9c-0.2,0.3-0.5,0.4-0.8,0.5c-0.3,0.1-0.6,0.1-0.9,0
                                c-0.3-0.1-0.6-0.2-0.8-0.4l0.4-0.4c0.2,0.2,0.5,0.3,0.8,0.3c0.3,0,0.6-0.1,0.8-0.4c0.2-0.3,0.3-0.5,0.3-0.9
                                c0-0.3-0.2-0.6-0.4-0.8l0.4-0.4c0.2,0.2,0.4,0.4,0.5,0.7C57,25.7,57.1,26,57,26.3z M62,30l-2.9-2.7l0.6,5.1L59.2,33l-3.7-3.4
                                l0.5-0.6l2.8,2.7l-0.6-5.1l0.5-0.6l3.7,3.4L62,30z"/>
                            <path class="flats_aside_scheme_fill" d="M68.3,23.3l-3.1-2.9L63,22.7l3.1,2.9l-0.5,0.6L62,22.7l3.2-3.4l3.7,3.4L68.3,23.3z"/>
                            <path class="flats_aside_scheme_fill" d="M70.5,15.3c0.5,0.1,0.9,0.3,1.2,0.6c0.3,0.3,0.6,0.7,0.7,1.2c0.1,0.4,0.2,0.9,0.1,1.4
                                c-0.1,0.5-0.3,0.9-0.6,1.2c-0.3,0.3-0.6,0.5-0.9,0.6c-0.3,0.1-0.7,0.2-1.1,0.1l2.6,2.4l-0.5,0.6l-5.7-5.3l0.5-0.6l0.6,0.5
                                c-0.1-0.4,0-0.7,0.1-1.1c0.1-0.4,0.3-0.7,0.6-1c0.3-0.3,0.7-0.6,1.1-0.7C69.6,15.2,70.1,15.2,70.5,15.3z M68,18.4
                                c0.1,0.3,0.3,0.6,0.6,0.9c0.3,0.2,0.6,0.4,0.9,0.5c0.3,0.1,0.7,0.1,1,0c0.3-0.1,0.6-0.3,0.9-0.6c0.2-0.3,0.4-0.5,0.4-0.9
                                c0.1-0.3,0-0.6-0.1-1c-0.1-0.3-0.3-0.6-0.5-0.8c-0.3-0.2-0.5-0.4-0.9-0.5c-0.3-0.1-0.7-0.1-1,0c-0.3,0.1-0.6,0.3-0.8,0.5
                                c-0.3,0.3-0.4,0.6-0.5,0.9C67.9,17.8,67.9,18.1,68,18.4z"/>
                            <path class="flats_aside_scheme_fill" d="M72.4,15.6l-0.5-0.5l2.4-2.6l0.5,0.5L72.4,15.6z"/>
                            <path class="flats_aside_scheme_fill" d="M75.5,9.2l3.2,2.9l-0.5,0.6L75,9.8l-1.3,1.4l-0.5-0.5l3.2-3.4l0.5,0.5L75.5,9.2z"/>
                        </g>
                    </g>
                </g>
        
                <g>
                    <g>
                        <g>
                            <path class="flats_aside_scheme_fill" d="M159.5,0.9l-0.3,0.5c-0.3-0.3-0.6-0.5-0.9-0.6c-0.3-0.1-0.7-0.2-1-0.2c-0.5,0-0.9,0.1-1.3,0.4
                                c-0.4,0.2-0.7,0.6-0.9,1c-0.2,0.4-0.3,0.9-0.3,1.4s0.1,1,0.3,1.4c0.2,0.4,0.5,0.8,0.9,1c0.4,0.2,0.8,0.4,1.3,0.4
                                c0.7,0,1.4-0.3,2.1-1l0.3,0.5c-0.7,0.7-1.5,1.1-2.4,1.1c-0.6,0-1.2-0.1-1.7-0.4c-0.5-0.3-0.9-0.7-1.2-1.2S154,4,154,3.4
                                s0.1-1.2,0.4-1.7c0.3-0.5,0.7-0.9,1.2-1.2c0.5-0.3,1-0.4,1.6-0.4c0.4,0,0.8,0.1,1.2,0.2C158.9,0.4,159.2,0.6,159.5,0.9z"/>
                        </g>
                    </g>
        
                    <circle class="flats_aside_scheme_figure" cx="156.8" cy="19.9" r="9.3"/>
                    <line class="flats_aside_scheme_figure" x1="156.8" y1="10.6" x2="156.8" y2="29.2"/>
                    <polygon class="flats_aside_scheme_fill" points="158.6,19.9 156.8,19.9 156.8,10.6 		"/>
                    <polygon class="flats_aside_scheme_fill" points="155,19.9 156.8,19.9 156.8,10.6 		"/>
                </g>
        
            </g>
        </svg>
            
    `;
    }

    public logotype = `
    <?xml version="1.0" encoding="utf-8"?>
    <!-- Generator: Adobe Illustrator 21.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
    <svg version="1.1" id="Слой_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 211.2 65" style="enable-background:new 0 0 211.2 65;" xml:space="preserve">
    <style type="text/css">
        .st0{clip-path:url(#SVGID_2_);}
        .st1{fill:#8AD0EC;}
    </style>
    <g>
        <defs>
            <rect id="SVGID_1_" width="211.2" height="65"/>
        </defs>
        <clipPath id="SVGID_2_">
            <use xlink:href="#SVGID_1_"  style="overflow:visible;"/>
        </clipPath>
        <g class="st0">
            <path class="st1" d="M201.9,23.9c-0.1-0.1-0.2,0-0.4,0c-0.2-0.4-0.6-0.7-0.9-0.6c-0.1,0-0.2,0.1-0.4,0.1c0,0,0,0,0,0
                c-0.2,0.1-0.2,0-0.4-0.1c-0.2,0-0.5,0.1-0.9,0.3c-0.3,0.2-0.6,0.2-0.9,0.1c-0.3,0-0.6,0.3-1.1,0.5c0,0-0.1,0-0.1,0
                c0,0-0.1,0-0.1,0c-0.6,0.1-0.3-0.3-0.7-0.3c-0.3,0-1.2,0.3-1.5,0.4c-0.3,0.1-0.8,0.4-1,0.4c-0.6,0.1-0.7-0.1-1-0.1
                c-0.1,0-0.9,0.8-1.1,0.8c-0.3,0-0.3-0.3-0.4-0.2c-0.1,0.1-0.3-0.1-0.4-0.1c-0.1,0-0.3,0.3-0.7,0.6c-0.1,0.1-0.2-0.4-0.3-0.3
                c-0.1,0.1-0.4,0.2-0.5,0.3c-0.2,0.1-0.2-0.2-0.4-0.1c-0.5,0.3-1.1,0.8-1.2,0.9c-0.4,0.2-0.6-0.2-0.9-0.1c-0.3,0-1.1,0.4-2.8,1.1
                c-1.2,0.5-2.5,0.9-3.3,1.2c0.1-0.1,1.1-2,1.7-2.9c0.6-0.8-1.4-4-2.1-3.7c-0.3,0.1-0.9,0.5-0.9,0.5s-1.2-3.1-5.7-3.2
                c-4.3-0.1-8.2,2.8-11.2,8.2c-2,3.7-2.1,6.7-1.8,8.2c-1.9,1.8-4.6,3.5-4.9,3.4c-1.4-0.4-2.3-4.8-4.7-7.5c-0.6-0.7-1.4-1.1-2.1-1.4
                c0.7-0.8,2.4-2.6,6-5.6c4.9-4.2,9.9-7,10.3-7.2c0.4-0.2,0.9,0.7,1.3,0.9c0.4,0.2,3,0.5,3-0.8s-2.2-5.8-3.8-6.6
                c-1-0.5-2.5,0-4.6,1.2l0,0c-0.5,0.3-1.3,0.6-1.5,0.7c-0.3,0.2-0.6,0.4-1,0.5c-0.4,0.1-0.6,0.7-0.9,0.9c-0.5,0.3-1,0.5-1.4,1
                c-0.2,0.2-0.3,0.5-0.7,0.7c-0.3,0.2-0.3,0.6-0.7,0.8c-0.3,0.1-0.7,0.4-1,0.6c-0.3,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.6,0.5-0.7,0.8
                c-0.2,0.4-0.4,0.5-0.7,0.7c-0.1,0.1-0.4,0.2-0.5,0.3c-0.5,0.6-1.1,1.3-1.5,2c-0.1,0.3-0.4,0.4-0.7,0.5c-0.5,0.2-0.7,0.7-0.9,1.1
                c-0.4,0.8-0.7,1.7-1.3,2.4c-0.7,0.7-1.2,1.6-1.7,2.5c-0.3,0.4-0.3,0.8-0.5,1.1c-0.1,0.3-0.3,0.7-0.4,1c-0.3,0.1-0.6,0.2-0.8,0.3
                c1.4-5.9,2.6-8.8,3.1-9.8c0.2-0.4-7.6-4.4-8.2-3.6c-0.9,1.3-3.3,5.5-5.5,14.8c-0.1,0.5-0.2,1-0.3,1.5c-2.2,1.9-7,5.4-7,5.4
                c0.1-1.4,1.8-6.8,2.3-8.2c0.1-0.4-1.8-3.8-2.2-4c-0.2-0.1-0.5,0-0.5,0s1.2-3.2,0.4-6.3c-0.8-3.1-3.8-7.8-6.9-7.6
                c-3.2,0.1-5.7,2.7-5.7,2.7s-0.5-0.4-1.1-0.6l0.1-0.1c-0.5-0.2-1.2-0.1-1.9,0c-0.3,0.2-0.6,0.6-0.9,0.8c-0.8,0.7-1.4,1-2.3,1.5
                c-0.1,0.1-0.5,0.7-0.5,0.8c-0.2,0.3-0.5,0-0.8,0.2c-0.6,0.4-0.9,0.8-1.3,1.6c-0.1,0.2-0.3,0.4-0.5,0.5c-0.1,0.1-0.3,0.1-0.4,0.2
                c-0.1,0.4-0.5,0.6-0.7,0.9c-0.7,0.6-1.1,1.4-1.4,2.2c-0.5,0-0.5,0.4-0.6,0.6c-0.2,0.4-0.4,0.7-0.6,1.1c-0.1,0.2-0.2,0.4-0.4,0.5
                c-0.3,0.4-0.6,0.8-0.9,1.1c-0.2,0.3-0.5,0.5-0.6,0.9c-0.2,0.8-0.7,1.3-1.1,1.9c-0.3,0.4-0.6,0.8-0.7,1.3c-0.3,1-0.4,1.9-1,2.7
                c0.2,0.5-0.1,1.1-0.2,1.3c-0.2,0.3-0.1,0.4,0,0.5c-0.9,3.3-1.6,6.9-1.7,9.7c-1.8,1.3-5.4,3.8-6.3,4.3c-0.3,0.2-0.3-1.9,0-3.7
                c0.4-1.9,2.1-5.4,3.5-7.6c0.2-0.4-0.3-2.1-2.1-4.5c-2-2.8-4.3-4.6-5.1-3.5c-1.6,2.3-4.3,6.6-7.8,13.1c-2.2,4.1-3.5,6-4.6,7.7
                c-1.3,2-2.3,1.2-2.4,1.5c-0.1,0.2,1.4,1.1,2.9,1.8c2.4,1.2,3.8,1.9,4.4,1.5c1.8-1.2,4.1-5.1,7.4-10.4c-0.1,2.4,0.3,4.6,0.7,5.3
                c0.5,0.8,2.5,1.5,2.9,1.2c1.8-1.4,4.3-3.6,6.5-5.5l0.1,1c0,0.3,0.1,1.1,0.4,1.7c0.3,0.6,1.5,1.5,3.2,2.3c1.8,0.9,3.4,1.4,4.4,1.1
                c3.3-0.9,8.6-4.3,12.3-7.9c6-5.8,8.2-9.4,8.2-9.4s-1.7,6.3-1,7.8c0.6,1.3,4.8,3.1,6,2.9c0.9-0.2,3.1-2.2,4.6-3.8
                c-0.1,1.8,0,3,0,3.4c0.1,0.7,1.7,1.5,3.7,2.5c2.2,1.1,5.2,2.1,5.4,1.8c0.5-0.8,0.1-5.3,2-15c0.1-0.5,0.2-1.1,0.3-1.6
                c0.8-0.4,2.1-0.7,3.3,0.7c1.4,1.8,3.5,6.9,4.7,8.7c0.4,0.6,2.8,1.1,3.5,0.5c1.7-1.6,5.3-5.1,6.5-6.5c1,1.7,5.3,3.4,6.7,2.9
                c2.9-1,8.1-5.5,8.1-5.5s1.3,1.3,4.1,3.4c2.5,2,5.7,0.9,7.2-0.1c3-2.1,8.1-6.4,11.7-9.6c0.1-0.1,0.2-0.2,0.3-0.2
                c1.1-1,3-2.8,3.4-3.2C202.5,24.1,202.1,24,201.9,23.9z M115,34.9c-5.9,8.1-12.8,10.7-12.8,10.3c0.1-0.6,0.1-5.6,6-14.4
                c6.8-10.1,13.1-12.3,13.4-11.9S121.3,26.3,115,34.9z M174,29c-3.6,3.8-7.6,4.1-7.6,4.1s0.2-3.1,2.3-6.5c2.2-3.4,4.4-5.4,6.6-5.3
                c2.6,0.2,2.9,2.4,2.9,2.4S177.4,25.6,174,29z"/>
            <path class="st1" d="M70.3,33.9c-2.3-4.8-5.5-11.2-5.4-11.8c0.2-0.7,4.7-3.5,11.8-6.5c8.5-3.6,27.2-9.1,40.3-10.8
                c9.6-1.3,12.5-0.3,13-0.9c0.2-0.2-0.2-1.3-0.8-2.5c-0.1-0.3-0.1-0.6-0.3-1c-0.1-0.1-0.3-0.2-0.5-0.3c-0.1-0.2-0.2-0.4-0.3-0.5
                v-0.5c-0.3-0.4-0.7-0.7-1.1-0.8c-0.2-0.1-0.3-0.2-0.4-0.3c-0.1,0-0.4-0.1-0.6-0.1c-0.3-0.2-0.6-0.5-0.9-0.7
                c-0.9,0.1-1.8-0.1-2.7,0.2c-0.2,0.1-0.5-0.2-0.7-0.1c-0.2,0.1-0.4,0.2-0.5,0c-0.2-0.3-0.4,0.1-0.6,0c-0.4-0.2-0.9,0-1.3-0.1
                c-0.5-0.2-0.9-0.2-1.4-0.2c-0.5,0.1-1,0.2-1.5,0.2c-0.1,0-0.1,0-0.2,0.1c-0.1,0.1-0.2,0.2-0.3,0.3c-0.8-0.1-1.7-0.2-2.4-0.3
                c-0.3,0.2-0.5,0.3-0.7,0.5c-0.1,0-0.1,0-0.2,0c-0.1-0.1-0.2-0.2-0.3-0.3c-0.3,0.2-0.6,0.4-1,0.4c0,0,0,0,0,0c-0.1,0-0.2,0-0.3,0
                c-0.1,0-0.2,0-0.3,0.1c-0.1,0-0.2,0-0.3,0c0,0,0,0-0.1-0.1c0,0-0.1,0.1-0.3,0.1c-0.4,0-0.7,0.1-1.1,0.1c-0.5-0.4-1-0.3-1.5,0.1
                c-0.5-0.2-0.7-0.2-1.2,0c-0.7,0.2-1.5,0.4-2.3,0.4c-0.5,0-1,0.3-1.6,0.2c-0.3,0.4-0.7,0.1-1.1,0.3c-0.6,0.3-1.3,0.3-2,0.5
                c-0.4,0.1-0.9,0.1-1.3,0.2C97.5,0,96.9,0,96.4,0.3c-0.5,0.2-1.9,0-1.9,0c-0.5,0.4-1.1,0.4-1.7,0.6C92.6,1,92.4,1,92.1,1
                c-0.7,0.1-1.4,0.2-1.8,0.7c-0.2-0.1-0.4-0.1-0.7-0.2c-0.1,0.2-0.2,0.3-0.3,0.5c-0.8-0.3-1.5,0.4-2.3,0.3c-0.1,0-0.1,0.1-0.2,0.1
                C86.3,2.6,85.7,3,85,2.8C85,3,84.9,3.2,84.9,3.2c-0.7,0.2-1.5,0.5-2.4,0.7c0,0-0.1,0.1-0.1,0.2c-0.3,0-0.6,0-0.8,0.1
                C81,4.4,80.5,4.9,79.9,5c-0.7,0.1-1.2,0.5-1.4,0.6c0,0-1.2,0.2-1.7,0.4c-0.7,0.2-1.3,0.8-2.1,0.8c-0.2,0.2-0.3,0.3-0.5,0.5
                c-0.7-0.2-1.4,0.6-1.6,0.7C72,8.1,71.4,8.2,71,8.7c-0.1,0.1-0.6,0.1-0.7,0.1c-0.8,0.4-1.1,1.3-2.3,1.2c-0.1,0.5-0.6,0.6-0.9,0.7
                c-1.1,0.4-2.1,0.8-2.8,1.8c-0.3,0.2-0.6,0.4-0.9,0.6h0c0,0,0,0,0,0c-0.3,0.2-0.6,0.4-0.9,0.6c-0.6,0.1-1.1,0.2-1.5,0.3
                c-0.2,0.2-0.4,0.4-0.6,0.6c-0.1,0.3-0.3,0.7-0.2,0.9c0.1,0.2,0.1,0.3,0.1,0.5c0,0,0,0.1,0,0.1c0,0.1,0,0.4,0.2,0.8
                c0.1,0.4,0.1,0.8,0.4,1.1c0.1,0.2,0.1,0.3,0.2,0.5c0.1,0.6,0.3,1,0.6,1.5c2.5,5.5,7.3,15.3,8,20c0.4,2.3,0,4.9-2.1,8.1
                c-2.5,3.7-6.2,5.2-6.2,5.2s-0.5-1.7,1.1-5.4c1.8-4,5.9-5.3,6.3-5.6c0.4-0.4-1.4-3.4-2-3.7c-0.5-0.3-2.7,0.2-8.8,1.6
                c-1.5,0.3-3.5,0.8-6,1.3c0.6-1.1,1.2-2.1,1.7-3.2c5.2-10.7,5-20.1-5.6-29.9C37.7-1.6,20.7,3.6,7.6,15C-5.4,26.4-5.8,36.8-5.6,38.6
                c0.2,1.8,0.5,2.3,1.2,2.9c0.3,0.3,1.3-0.1,1.3-0.1s2.9,6.3,5.5,8.1c0.3,0.2,1.8,0.1,2.9-0.1C3.5,54,3.8,57.1,5,60.1
                c1.3,3.2,8,7.3,11.5,8.9c0,0,0,0,0,0c0.5,0.3,0.8,0.5,1.1,0.7c0.4,0.1,0.8,0.1,1,0.6c0.5-0.2,1-0.3,1.5-0.5c0-0.1,0.1-0.2,0.1-0.3
                c0,0,0.1,0,0.1,0c0.4,0.1,0.7,0.3,1.1,0.4c0.5-0.2,0.9-0.5,1.4-0.7c0.2-0.6,0.4-1,1-1.1c0.2,0.1,0.3,0.3,0.4,0.4
                c0.4-0.2,0.8-0.2,1.1-0.6c0.4,0.1,0.5-0.5,0.9-0.4c0.2-0.4,0.7-0.4,1-0.6c0.3-0.2,0.6-0.6,0.9-0.8h0.4c0.1-0.1,0.2-0.3,0.3-0.4
                c-0.2-0.1-0.3-0.1-0.4-0.2c0.7-0.4,1.2-0.9,2-1c0-0.1,0-0.2,0.1-0.3c0.2,0,0.4-0.1,0.5-0.1c0-0.1,0.1-0.2,0.1-0.3
                c0.3,0,0.6,0,0.8-0.1c0-0.2-0.1-0.3-0.1-0.6c0.3,0.1,0.5,0.2,0.5,0.2c0.4-0.3,0.8-0.6,1.1-0.9c0.5-0.4,1.2-0.7,1.3-1.4
                c0.8-0.1,1.3-0.5,1.7-1c0.1-0.1,0.1-0.4,0.1-0.5c0.5-0.2,0.6-0.8,1.1-1c0.3-0.1,0.6-0.4,0.8-0.6c0.3-0.3,0.7-0.6,1-0.8
                c0.3-0.3,0.6-0.7,1-0.9c0.4-0.2,0.5-0.8,0.9-1.4c3.5-3.5,7-7.6,9.7-11.9c4.2-0.7,7.1-1.2,7.1-1.2s-2,1.8-2.9,5.3
                c-1,3.9,0.1,8.7,3.3,10.2c1.1,0.5,3,0.6,5.5-1.2c2.5-1.8,6.4-6.6,7.5-10.5C72.6,42.8,73.2,40,70.3,33.9z M42.3,38.9
                c-1.3,1.9-2.8,3.7-4.5,5.4c-4.9,0.9-5.7,1.4-10.8,2.4c-0.3,0.1-1.6,0.4-1.6,0.4c3.1-0.5,6.2-0.9,11.3-1.7
                c-9.2,8.8-21.3,14.1-21.3,14.1s-0.7-1.3,0.3-5.8c0.4-1.6,1.2-3.5,2.2-5.4c0.8-0.1,3.1-0.5,4.7-0.8c0.6,0-0.8,0.1-0.8,0
                c-1.2,0.2-3.3,0.3-3.7,0.3c1.8-3.2,4.1-6.3,5.4-7.3c0.9-0.7-3.2-8.8-4.6-8c-1.7,0.9-7.5,5-11.3,12.1c-0.7,1.2-1.5,2.9-1.9,4
                c-1,0.2-2.2,0.3-2.5,0c-1.1-1-1.9-5.2-1.8-7.5C1.6,36.8,3.3,28.4,12,19.6c8.7-8.8,25.3-15.6,33.5-10C53.8,15.2,51,26.3,42.3,38.9z
                "/>
        </g>
    </g>
    </svg>`
}
