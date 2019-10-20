import { formatAmount, formatPercentage, printf } from "@/utils/utils.js";

describe('Numeber formatting', () => {
  it('format 1000 to 1,000', () => {
    expect(formatAmount(1000)).toMatch("1,000")
  })
  it('format 1000000 to 1,000,000', () => {
    expect(formatAmount(1000000)).toMatch("1,000,000")
  })
  it('format 0 to 0', () => {
    expect(formatAmount(0)).toMatch("0")
  })
})

describe('Percentage formatting', () => {
  it('format 0 to 0%', () => {
    expect(formatPercentage(0)).toMatch("0%")
  })
  it('format 0.23456 to 23.46%', () => {
    expect(formatPercentage(0.23456)).toMatch("23.46%")
  })
  it('format -0.23456 to -23.46%', () => {
    expect(formatPercentage(-0.23456)).toMatch("-23.46%")
  })
  it('format 0.0000456 to 0046%', () => {
    expect(formatPercentage(0.0000456)).toMatch("0.0046%")
  })
  it('format -0.0000456 to -0046%', () => {
    expect(formatPercentage(-0.0000456)).toMatch("-0.0046%")
  })
  it('format NaN to N/A', () => {
    expect(formatPercentage(NaN)).toMatch("N/A")
  })
  it('format Infinity to N/A', () => {
    expect(formatPercentage(Infinity)).toMatch("N/A")
  })

})


describe('Printf', () => {
  it('print without params', () => {
    expect(printf("test format")).toMatch("test format");
  })
  it('print "param1"', () => {
    expect(printf("%s", "param1")).toMatch("param1");
  })
  it('print "param1 param2"', () => {
    expect(printf("%s %s", "param1", "param2")).toMatch("param1 param2");
  })
  it('print "param1 param2"', () => {
    expect(printf("%s", "param1", "param2")).toMatch("param1");
  })
  it('print "param1 param2 %s"', () => {
    expect(printf("%s %s %s", "param1", "param2")).toMatch("param1 param2 %s");
  })
})