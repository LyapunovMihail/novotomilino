import {
    Controller,
    Get,
    Req,
    Res,
} from '@nestjs/common';
import {
    clientRender,
} from '../utilits/client-render';

@Controller()
export class PagesController {
    @Get('*')
    renderPage(@Req() req, @Res() res) {
        clientRender(req, res, 200);
    }

}
