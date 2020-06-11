/*

    Обертка для обработки ответа/ошибки в асинхронных функциях
    для сокращения написания роута в контроллерах

    Пример:

    this.app.get('/api/credit', responseHandler(async(req) => {
        return await this.controller.getSnippet();
    }));

*/
// принимает асинхронную функцию fn
export var responseHandler = function (fn) {
    // middleware expressJS@
    return function (req, res) {
        // передав request аргументом
        fn(req).then(function (response) { return res.json(response); })
            // ловит ошибку
            .catch(function (error) {
            console.log(error);
            res.status(500).json({ error: error });
        });
    };
};
//# sourceMappingURL=response-handler.utilits.js.map