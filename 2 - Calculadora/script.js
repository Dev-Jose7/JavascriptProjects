document.addEventListener("DOMContentLoaded", function(){
    //1 - Declaración de variables
    const elementoEntrada = document.getElementById("entrada");
    const elementoSalida = document.getElementById("salida");
    const elementoVisor = document.getElementById("visor");
    const elementoBoton = document.querySelectorAll(".boton");
    const elementoDecimal = document.querySelector(".boton--decimal");
    const elementoContenedor = document.querySelector(".visor__entrada");
    let numero1 = 0;
    let numero2 = 0;
    let resultado = 0;
    let terminar = false;
    let operacion = false;
    let teclado = false;
    let signo = "";
    

    modoOscuro();

    //Detecta si la página esta siendo vista desde un celular para bloquear el teclado móvil
    if(/Mobi|Android/i.test(navigator.userAgent) == true){
        console.log("verdadero");
        elementoEntrada.setAttribute("inputmode", "none");
    }
    
    //2 - Registro de eventos
    document.querySelector("html").addEventListener("click", function(){
        elementoEntrada.focus();
    });
    
    //Evento para detectar cuando el usuario presiona una tecla
    elementoEntrada.addEventListener("keydown", function(e){
        let id = e.key;
        teclado = false;

        if(id == "." && elementoEntrada.value.includes(".")){
            e.preventDefault(); //Cancela el evento
        }

        if(id == "c" || id == "C"){
            let reset = true;
            formatearCampo(reset);
        }

        if(id == "Enter" && signo == "r"){
            operacionAritmetica();
        }

        //Permite detectar el signo a eligir por el usuario para seguidamente guardar el valor del resultado en el primer numero y dar continuadad con el resultado más reciente en la siguiente operación como primer numero
        //Evita calcular mal el resultado cuando el usuario desea cambiar de signo por equivocación, para que funcione debe de eliminar todo el segundo número o sino se realizará un calculo acumulado usando el resultado más reciente
        if(id == "+" || id == "-" || id == "*" || id == "/" || id == "%" || id == "a" || id == "p" || id == "s" || id == "r" || id == "round" || id == "floor" || id == "ceil" || id == "="){
            operacion = true;
            if(numero2 == 0){ //Si el número2 es cero, entonces se invocará esta función y para este momento numero1 tendra ya un primer valor pero la variable numero2 será cero, de esta manera al momento de que el usuario cambie el signo por error la operación se realizará con número cero y no afectará ni el resultado ni el numero1
                operacionAritmetica();
            }   
        }

        detectarNumero(id);
        
    });

    
    elementoEntrada.addEventListener("input", function(e){
        let id = e.target.value;

        //Evitar que los signos aritmeticos sean escritos en el campo, esto con el fin de no alterar los números
        const simbolos = /[^0-9]/g;
        e.target.value = e.target.value.replace(simbolos, "");
        
        if(teclado == false){//Sirve cuando se usan los dos teclados al tiempo para evitar perdida de datos en las variables
            detectarNumero(id);
        }
        
        if(id != ""){ //Permite calcular los valores en tiempo real y evita que no se recalculen cuando se eliminen números
            operacionAritmetica();
        }else{
            if(id == "" && numero2 == 0){//Borra el resultado más reciente para una siguiente operación y no se entreguen datos incorrectos 
                elementoSalida.value = ""; 
            }
        }

        imprimirVisor(id);
        scrollVertical();
            
    });

    for(let i=0; i<elementoBoton.length; i++) {
        elementoBoton[i].addEventListener("click", function(e){
            let id = e.target.textContent;
            teclado = true;

            if(id == "+" || id == "-" || id == "x" || id == "/" || id == "-" || id == "%" || id == "round" || id == "floor" || id == "ceil" || id == "="){
                signo = id;
                id = "";
                operacion = true;
            }

            switch (id) {
                case "C":
                    id = "";
                    reset = true;
                    formatearCampo(reset);
                    break;

                case "|x|":
                    signo = "a";
                    id = "";
                    operacion = true;
                    break;

                case "x?":
                    signo = "r";
                    id = "";
                    operacion = true;
                    break;

                case "x2":
                    signo = "p";
                    id = "";
                    operacion = true;
                    break;

                case "√":
                    signo = "s";
                    id = "";
                    operacion = true;
                    break;

                case "=":
                    break;

                case "⬅":
                    id = "";
                    elementoEntrada.value = elementoEntrada.value.slice(0, -1);
                default:
                    break;
            }

            detectarNumero(id);
            imprimirVisor(id);
            operacionAritmetica();
            scrollVertical();

            e.target.style.boxShadow = "inset -5px -5px 3px 0px rgba(0, 0, 0, 0.2)";
            e.target.style.scale = "0.95";
            setTimeout(() => {
                e.target.style.boxShadow = "5px 5px 3px 0px rgba(0, 0, 0, 0.1)";
                e.target.style.scale = "unset";
            }, 250);
        });
    }

    elementoDecimal.addEventListener("click", function(e){
        console.log(e)
        
        if(elementoDecimal.textContent == "."){
            this.disabled = true;
        }
    });

    //3 - Declaración de funciones
    function detectarNumero(e) {
        console.log(e)
        // Se consiguen los dos números de acuerdo a la entrada

        if(teclado == true){ //TECLADO VIRTUAL
            if(signo == ""){ //Primer operación
                elementoEntrada.value += e;
                numero1 = +elementoEntrada.value;
                console.log("n1: " + numero1 + " teclado virtual");
                operacion = false;
            }

            //Se detecta el signo a utilizar para seguidamente limpiar el campo y así poder escribir el segundo número
            if(signo == "+" || signo == "-" || signo == "x" || signo == "/" || signo == "%" || signo == "a" || signo == "p" || signo == "s" || signo == "r" || signo == "round" || signo == "floor" || signo == "ceil"){
                if(numero2 == 0){
                    formatearCampo();
                    elementoDecimal.disabled = false;

                    if(signo == "x"){
                        signo = "*";
                    }

                    console.log(numero1);
                    console.log(numero2);
                    console.log("campo formateado");
                }

                if(numero2 != 0 && operacion == true){ //Almacena el valor del resultado en el primer número con el fin de utilizarlo para la siguiente operación
                    numero1 = resultado;
                    console.log(resultado + " Resultado");
                    console.log(numero1 +  " Numero 1");
                    formatearCampo();
                    operacionAritmetica();
                }

                if(resultado != 0 && operacion == true && numero2 == 0){
                    numero1 = resultado;
                }
                
            }

            if(signo != "" && e != "="){
                elementoEntrada.value += e;
                numero2 = +elementoEntrada.value;
                console.log("n2: " + numero2 + " teclado virtual");
                operacion = false;
            }
        }

        if(teclado == false){ //TECLADO FÍSICO
            if(signo == ""){
                numero1 = +elementoEntrada.value;
                console.log("n1: " + numero1 + " por teclado");
                operacion = false;
            }
        
            //Se detecta el signo a utilizar para seguidamente limpiar el campo y así poder escribir el segundo número
            if(e == "+" || e == "-" || e == "*" || e == "/" || e == "%" || e == "a" || e == "p" || e == "s" || e == "r" || e == "round" || e == "floor" || e == "ceil"){
                signo = e;
                if(signo != ""){
                    formatearCampo();
                    console.log("campo formateado");
                }

                if(operacion == true){ //Almacena el valor del resultado en el primer número con el fin de utilizarlo para la siguiente operación
                    numero1 = resultado;
                    console.log(resultado + " Resultado");
                    console.log(numero1 +  " Numero 1");
                    operacionAritmetica();
                }
            }
        
            if(signo == "+" || signo == "-" || signo == "*" || signo == "/" || signo == "%" || signo == "p" || signo == "r"){
                if(signo != "" && e != "="){
                    numero2 = +elementoEntrada.value;
                    console.log("n2: " + numero2 + " teclado fisico");
                    operacion = false;
                }
            }
        }

        if(e == "Enter" || e == "="){ //Permite entregar solo el resultado en el visor para usarlo en otra operación o solo terminar de calcular
            if(signo != "r"){ //Permite calcular de forma dinamica aquellas operaciones diferentes a estas ya que estas operaciones solo constan de entregar el resultado en varias ocasines en el visor cuando se oprima el enter
                terminar = true;
                numero1 = resultado;
                formatearCampo();
                elementoVisor.textContent = numero1 + elementoEntrada.value;
            }else{
                operacionAritmetica();
            }
        }
    }

    function imprimirVisor(e){
        if(teclado == true){
            tecladoVirtual();
        }

        if(teclado == false){
            tecladoFisico();
        }
        
        if(e == "⬅"){
            elementoVisor.textContent = elementoEntrada.value;
        }

        function tecladoVirtual(){
            
            if(resultado == 0){
                elementoVisor.textContent = elementoEntrada.value;
            }
            
            if(signo != ""){
                elementoVisor.textContent = +numero1.toFixed(3) + " " + signo + " " + elementoEntrada.value;

                if(signo == "="){
                    elementoVisor.textContent = resultado;
                    elementoSalida.value = "";
                    elementoEntrada.value = "";
                }
    
                if(signo == "*"){
                    elementoVisor.textContent = +numero1.toFixed(3) + " x " + elementoEntrada.value;
                }
    
                if(signo == "%"){
                    elementoVisor.textContent = +numero1.toFixed(3) + " " + "(" + elementoEntrada.value + "%" + ")";
                }
    
                if(signo == "a"){
                    elementoVisor.textContent = "|" + +numero1.toFixed(3) + "|"
                }
    
                if(signo == "p"){
                    elementoVisor.textContent = +numero1.toFixed(3) + " ^ " + elementoEntrada.value;
                }
    
                if(signo == "s"){
                    elementoVisor.textContent = "√" + +numero1.toFixed(3);
                }
    
                if(signo == "r"){
                    elementoVisor.textContent = "(" + +numero1.toFixed(3) + ")" + "(" + elementoEntrada.value + ")";
                }
    
                if(signo == "round"){
                    elementoVisor.textContent = resultado;
                }
    
                if(signo == "floor"){
                    elementoVisor.textContent = resultado;
                }
    
                if(signo == "ceil"){
                    elementoVisor.textContent = resultado;
                }
            }
            
        }

        function tecladoFisico(){
            elementoVisor.textContent = elementoEntrada.value;

            if(signo != ""){
                elementoVisor.textContent = +numero1.toFixed(3) + " " + signo + " " + elementoEntrada.value;
    
                if(signo == "*"){
                    elementoVisor.textContent = +numero1.toFixed(3) + " x " + elementoEntrada.value;
                    console.log("Por")
                }
    
                if(signo == "%"){
                    elementoVisor.textContent = +numero1.toFixed(3)  + " " + "(" + elementoEntrada.value + "%" + ")";
                }
    
                if(signo == "a"){
                    elementoVisor.textContent = "|" + +numero1.toFixed(3) + "|"
                }
    
                if(signo == "p"){
                    elementoVisor.textContent = +numero1.toFixed(3) + " ^ " + elementoEntrada.value;
                }
    
                if(signo == "s"){
                    elementoVisor.textContent = "√" + +numero1.toFixed(3)
                }
    
                if(signo == "r"){
                    elementoVisor.textContent = "(" + +numero1.toFixed(3) + ")" + "(" + elementoEntrada.value + ")";
                }
    
                if(signo == "round"){
                    elementoVisor.textContent = resultado;
                }
    
                if(signo == "floor"){
                    elementoVisor.textContent = resultado;
                }
    
                if(signo == "ceil"){
                    elementoVisor.textContent = resultado;
                }
            }
        }
    }

        

    function operacionAritmetica(){
        switch (signo) {
            case "+":
                resultado = sumar(numero1, numero2);
                imprimirResultado(resultado);
                break;

            case "-":
                resultado = restar(numero1, numero2);
                imprimirResultado(resultado);
                break;

            case "*":
                if(numero2 == 0){
                    numero2 = 1;
                }
                resultado = multiplicar(numero1, numero2);
                imprimirResultado(resultado);
                break;

            case "/":
                if(numero2 == 0){
                    numero2 = 1;
                }
                resultado = dividir(numero1, numero2);
                imprimirResultado(resultado);
                break;

            case "%":
                if(numero2 == 0){
                    numero2 = 100;
                }
                resultado = porcentaje(numero1, numero2);
                imprimirResultado(resultado);
                break;

            case "a":
                resultado = absoluto(numero1);
                imprimirResultado(resultado);
                break;

            case "p":
                resultado = potencia(numero1, numero2);
                imprimirResultado(resultado);
                break;

            case "s":
                resultado = raiz(numero1);
                imprimirResultado(resultado);
                break;

            case "r":
                resultado = random(numero1, numero2);
                imprimirResultado(resultado);
                break;

            case "round":
                resultado = round(numero1);
                imprimirResultado(resultado);
                break;

            case "floor":
                resultado = floor(numero1);
                imprimirResultado(resultado);
                break;

            case "ceil":
                resultado = ceil(numero1);
                imprimirResultado(resultado);
                break;

            default:
                break;
        }
    }


    //Limpia el campo de entrada
    function formatearCampo(x){
        elementoEntrada.value = "";
        
        if(terminar == true){
            elementoSalida.value = "";
        }

        if(x == true){
            numero1 = 0;
            numero2 = 0;
            resultado = 0;
            signo = "";
            operacion = false;
            elementoSalida.value = "";
            elementoDecimal.disabled = false;
            console.log("borrado");
        }
    }

    function imprimirResultado(x){
        elementoSalida.value = x;
    }
        
    

    function sumar(x, y){
        return x + y;
    }
    
    function restar(x, y){
        return x - y;
    }

    function multiplicar(x, y){
        return x * y;
    }

    function dividir(x, y){
        return x / y;
    }

    function absoluto(x) {
        return Math.abs(x);
    }

    function potencia(x, y){
        return Math.pow(x, y);
    }

    function raiz(x){
        return Math.sqrt(x);
    }

    function porcentaje(x, y){
        return (x/100) * y;
    }

    function random(x, y){
        let resultado = 0;
        if(x > y){
            x++
            resultado = Math.floor(Math.random() * (x - y) + y);
        }else{
            y++
            resultado = Math.floor(Math.random() * (y - x) + x);
        }

        return resultado;
    }

    function round(x){
        return Math.round(x);
    }

    function floor(x){
        return Math.floor(x);
    }

    function ceil(x){
        return Math.ceil(x);
    }

    function scrollVertical(){
        //Permite al scroll situarse a la izquierda cuando el contenido se sobre salga del área visible del elemento 
        if(elementoVisor.scrollWidth > elementoVisor.clientWidth){ //Detecta si el contenido del elemento se desborda (overflow)
            elementoVisor.scrollLeft = elementoVisor.scrollWidth;
            //scrollWidth: Tamaño completo: (Ancho visible + scroll)
            //clientWidth: Solo área visible 
        }

        if(elementoSalida.scrollWidth > elementoSalida.clientWidth){
            elementoSalida.style.fontSize = "3.7vh"
        }else{
            elementoSalida.style.fontSize = "5.5vh"
        }
    }

    function modoOscuro(){
        const date = new Date();
        let hora = date.getHours();

        if(hora >= 22 || hora <=6){
            elementoVisor.style.color = "whitesmoke";
            elementoSalida.style.color = "#FFF";
            document.querySelector("body").style.backgroundColor = "#15212e";
            document.querySelector(".visor").style.background = "rgba(21,33,46,1)";
            document.querySelector(".visor").style.background = "linear-gradient(to bottom, rgba(21,33,46,1) 0%, rgba(14,22,31,1) 100%)";
        }
    }
});