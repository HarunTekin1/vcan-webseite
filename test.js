// Funktion: zwei Zahlen addieren und validieren
function add(a, b) {
   if (typeof a !== "number" || typeof b !== "number") {
       throw new Error("Ungültige Eingabe: Bitte geben Sie zwei Zahlen ein.");
   }
   return a + b;
}j