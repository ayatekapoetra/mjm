'use strict'

var fs = require('fs')
class base64Img {
    async GEN_BASE64(path){
        var imageAsBase64 = fs.readFileSync(path, 'base64');
        return `data:image/jpeg;base64,${imageAsBase64}`
    }

    async pembilang(nilai){
        nilai = Math.abs(nilai);
        var simpanNilaiBagi=0;
        var huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        var temp="";
     
        if (nilai < 12) {
            temp = " "+huruf[nilai];
        }
        else if (nilai <20) {
            temp = await this.pembilang(nilai - 10) + " Belas";
        }
        else if (nilai < 100) {
            simpanNilaiBagi = Math.floor(nilai/10);
            temp = await this.pembilang(simpanNilaiBagi)+" Puluh"+ await this.pembilang(nilai % 10);
        }
        else if (nilai < 200) {
            temp = " Seratus" + await this.pembilang(nilai - 100);
        }
        else if (nilai < 1000) {
            simpanNilaiBagi = Math.floor(nilai/100);
            temp = await this.pembilang(simpanNilaiBagi) + " Ratus" + await this.pembilang(nilai % 100);
        }
         else if (nilai < 2000) {
            temp = " Seribu" + await this.pembilang(nilai - 1000);
        }
        else if (nilai < 1000000) {
            simpanNilaiBagi = Math.floor(nilai/1000);
            temp = await this.pembilang(simpanNilaiBagi) + " Ribu" + await this.pembilang(nilai % 1000);
        } 
        else if (nilai < 1000000000) {
            simpanNilaiBagi = Math.floor(nilai/1000000);
            temp =await this.pembilang(simpanNilaiBagi) + " Juta" + await this.pembilang(nilai % 1000000);
        } 
        else if (nilai < 1000000000000) {
            simpanNilaiBagi = Math.floor(nilai/1000000000);
            temp = await this.pembilang(simpanNilaiBagi) + " Miliar" + await this.pembilang(nilai % 1000000000);
        } 
        else if (nilai < 1000000000000000) {
            simpanNilaiBagi = Math.floor(nilai/1000000000000);
            temp = await this.pembilang(nilai/1000000000000) + " Triliun" + await this.pembilang(nilai % 1000000000000);
        }
     
        return temp;
    }
}
module.exports = new base64Img()