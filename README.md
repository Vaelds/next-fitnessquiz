# NEXT Fitnessquiz – Visual Studio Code og Visual Studio Professional

Projektet er en almindelig ASP.NET Core 8-løsning med semantisk HTML, separat CSS, JavaScript, quizdata, lokale fonte og lokale billedfiler.

## Hurtig forhåndsvisning i Visual Studio Code

1. Pak hele ZIP-filen ud. Projektet må ikke køres direkte inde fra ZIP-filen.
2. Åbn `NEXT-fitnessquiz.code-workspace` i Visual Studio Code.
3. Installer den anbefalede Microsoft-udvidelse **Live Preview**, hvis VS Code spørger.
4. Åbn `index.html` i hovedmappen.
5. Klik på Live Preview-ikonet øverst til højre, eller højreklik i filen og vælg **Show Preview**.

`index.html` i hovedmappen sender automatisk forhåndsvisningen videre til den rigtige hjemmeside i `NEXTFitnessQuiz/wwwroot`.

## Åbn projektet i Visual Studio Professional

1. Pak hele ZIP-filen ud.
2. Åbn `NEXTFitnessQuiz.sln` i Visual Studio Professional 2022.
3. Sørg for, at arbejdsbyrden **ASP.NET og webudvikling** samt .NET 8 SDK er installeret.
4. Tryk `F5` eller vælg **NEXTFitnessQuiz** og klik på den grønne startknap.

Der skal ikke installeres npm-pakker.

## Projektets opbygning

- `NEXTFitnessQuiz/Program.cs` – webserverens startpunkt.
- `NEXTFitnessQuiz/wwwroot/index.html` – semantisk HTML og sidestruktur.
- `NEXTFitnessQuiz/wwwroot/css/site.css` – hele det responsive design.
- `NEXTFitnessQuiz/wwwroot/js/quiz.js` – quizmotor, navigation og evaluering.
- `NEXTFitnessQuiz/wwwroot/data/questions.js` – spørgsmål, svar og forklaringer samlet ét sted.
- `NEXTFitnessQuiz/wwwroot/assets/` – lokale fonte, NEXT-logo og grafik.

Spørgsmål kan redigeres i `data/questions.js` uden at ændre quizmotoren.

## Fagligt grundlag

- *Anatomi – Underkroppens muskler*
- *Fitness og styrketræning*, 5. udgave, 2024
