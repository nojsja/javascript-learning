function parse2Int(num) {
    if (/^0x[0-9]*$/.test(num))
        return 0;
    return parseInt(num);
}

console.log(parse2Int('0x12'));
