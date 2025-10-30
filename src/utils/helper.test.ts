import {formatTime} from "./helper"

describe('formatTime', () => {
  it('Добавление нуля если секунд < 10', () => {
    expect (formatTime(61)).toBe('1:01');
  });
  it('Форматирует время < 1 минуты', () => {
    expect (formatTime(35)).toBe('0:35');
  });
  it('Обрабатывает 0 секунд', () => {
    expect (formatTime(0)).toBe('0:00');
  });
});