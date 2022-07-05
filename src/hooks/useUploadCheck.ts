interface CheckCondition{
    format?: string[];
    size?: number;
}
// 规定错误类型
type ErrorType = 'format' | 'size' | null;

export default function beforeUploadCheck(file: File, condition: CheckCondition) {
    const { format, size } = condition;
    // 验证文件类型是否在所包含类型中
    const isValidFormat = format ? format.includes(file.type) : true;
    // 验证文件大小，单位为 M
    const isValidSize = size ? (file.size /1024 /1024 < size) : true;

    let error: ErrorType = null;
    if(!isValidFormat) {
        error = 'format';
    }
    if(!isValidSize) {
        error = 'size';
    }
    return {
        passed: isValidFormat && isValidSize,
        error
    }
}