export const formatDataByYear = (dataOne, dataTwo) => {
    const formattedDataByYearArray = [];

    for (let key of Object.keys(dataOne[0])) {
        if (key !== 'regionName') {
            const yearData = [];
            let year = 0;
            dataOne.forEach((el, idx) => {
                const regionName = dataOne[idx]['regionName'];
                if (key !== 'regionName') {
                    yearData.push({
                        regionName: regionName,
                        value: +dataOne[idx][key],
                        valueF2: +dataTwo[idx][key]
                    });
                    year = +key;
                }
            });

            formattedDataByYearArray.push({
                id: formattedDataByYearArray.length + 1,
                yearData: yearData,
                year: year
            })
        }
    }
    return formattedDataByYearArray;
}

export const formatDataByRegion = (dataOne, dataTwo) => {
    const formattedArrayByRegion = [];
    dataOne.forEach((el, idx) => {
        const regionData = [];
        let regionName = '';
        for (let key of Object.keys(dataOne[idx])) {
            if (key !== 'regionName') {
                regionData.push({
                    year: key,
                    value: +dataOne[idx][key],
                    valueF2: +dataTwo[idx][key]
                })
            } else {
                regionName = dataOne[idx][key];
            }
        }
        formattedArrayByRegion.push({
            id: formattedArrayByRegion.length + 1,
            regionData: regionData,
            regionName: regionName
        });
    })
    return formattedArrayByRegion;
}

export const createYearList = (dateOne, dateTwo) => {
    const mergedArray =  [
        ...new Set([
            ...Object.keys(dateOne[0]),
            ...Object.keys(dateTwo[0])
        ])
    ];
    return mergedArray.reduce(
        (acc, current, currentIndex) =>
            current !== 'regionName'?
                [...acc, { value: currentIndex + 1, name: +current}] : acc,
        [])
}
