import { PDFGeneratorController } from './pdf-generator.controller';

export class PDFGenerator {

    public pdfCtrl: any;

    constructor ( private app, private db ) {
        this.pdfCtrl = new PDFGeneratorController(db);
        this.routes();
    }

    public routes() {
        this.app.get('/api/pdf', (req, res) => {
            this.pdfCtrl.create(req, res);
        });
    }
}
