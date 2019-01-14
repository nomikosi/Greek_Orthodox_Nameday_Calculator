
function orthodoxEasterFunct(year) {
    y = year;
    d = (19 * (y % 19) + 15) % 30;
    x = d + (2 * (y % 4) + 4 * (y % 7) - d + 34) % 7 + 114;
    m = ~~(x / 31);
    d = x % 31 + 1;
    if (y > 1899 && y < 2100) {
        d += 13;
        if (m == 3 && d > 31) {
            d -= 31;
            m++
        }
        if (m == 4 && d > 30) {
            d -= 30;
            m++
        }
    }
    return new Date(y, m - 1, d, 0, 0, 0, 0);
//    return((d < 10 ? "0" + d : d) + "/0" + m + "/" + y);
}

exports.orthodoxEasterFunct = orthodoxEasterFunct;

