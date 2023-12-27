import xlsx from 'xlsx';
import { writeFile, readFile, mkdir, access } from 'fs/promises';
import { createYearList, formatDataByRegion, formatDataByYear } from '../utils/fileModifier.js';
import { getPath } from '../utils/path.js';

const filePathFirst = getPath('db', 'statisticFirst.json');
const filePathSecond = getPath('db', 'statisticSecond.json');
let fileName = '';

export const getStatisticByYear = async (req, res) => {
    const [ dataOne, dataSecond ] = await readFileFromServer();

    try {
        if (dataOne.length > 0 && dataSecond.length > 0) {
            const modifiedDataByYear = formatDataByYear(JSON.parse(dataOne), JSON.parse(dataSecond));

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(modifiedDataByYear);
        } else {
            return res.status(400).json({error: 'Files are empty'});
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getStatisticByYearId = async (req, res) => {
    const yearId = +req.params.yearId;
    const [ dataOne, dataSecond ] = await readFileFromServer();

    try {
        if (dataOne.length > 0 && dataSecond.length > 0) {
            const modifiedDataByYear = formatDataByYear(JSON.parse(dataOne), JSON.parse(dataSecond));

            const modifiedDataByYearId = modifiedDataByYear.filter(
                data => data.id === yearId
            )[0];

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(modifiedDataByYearId);
        } else {
            return res.status(400).json({error: 'Files are empty'});
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getStatisticByRegion = async (req, res) => {
    const [ dataOne, dataSecond ] = await readFileFromServer();

    try {
        if (dataOne.length > 0 && dataSecond.length > 0) {
            const modifiedDataByRegion = formatDataByRegion(JSON.parse(dataOne), JSON.parse(dataSecond));
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(modifiedDataByRegion);
        } else {
            return res.status(400).json({error: 'Files are empty'});
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const uploadStatisticFile = async (req, res) => {
    const file = req.file;
    fileName = req.body.fileName;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const workbook = xlsx.read(
        file.buffer,
        { type: 'buffer' }
    );
    const dataFirst = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
    );
    const dataSecond = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[1]]
    );

    try {
        if (dataFirst.length > 0 && dataSecond.length > 0) {
            try {
                await access(
                    getPath('db', null)
                );
            } catch (err) {
                await mkdir(
                    getPath('db', null),
                    { recursive: true }
                );
            }

            await writeFileToServer(dataFirst, dataSecond);
            res.status(200).json({ message: 'JSON file saved successfully' });
        } else {
            return res.status(400).json({error: 'Files are empty'});
        }
    } catch(error) {
        console.error('Error saving JSON file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const writeFileToServer = async (dataFirst, dataSecond) => {
    await Promise.all([
        writeFile(
            filePathFirst,
            JSON.stringify(dataFirst, null, 2)
        ),
        writeFile(
            filePathSecond,
            JSON.stringify(dataSecond, null, 2)
        )
    ]);
}

const readFileFromServer = async () => {
    return await Promise.all([
        readFile(filePathFirst, 'utf-8'),
        readFile(filePathSecond, 'utf-8')
    ]);
}

export const downloadTemplateFile = (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=statistic-data-template.xlsx');
        res.sendFile(getPath('template-file', 'statistic-data-template.xlsx'));
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getYearListFromFile = async (req, res) => {
    const [ dataOne, dataSecond ] = await readFileFromServer();

    try {
        if (dataOne.length > 0 && dataSecond.length > 0) {
            const uniqueYearList = createYearList(JSON.parse(dataOne), JSON.parse(dataSecond));
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({ years: uniqueYearList, fileName });
        } else {
            return res.status(200).json([]);
        }

    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
