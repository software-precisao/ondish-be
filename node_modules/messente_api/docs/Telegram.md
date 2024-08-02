# MessenteApi.Telegram

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sender** | **String** | Phone number or alphanumeric sender name | [optional] 
**validity** | **Number** | After how many minutes this channel is considered as failed and the next channel is attempted | [optional] 
**text** | **String** | Plaintext content for Telegram | [optional] 
**imageUrl** | **String** | URL for the embedded image. Mutually exclusive with \&quot;document_url\&quot; and \&quot;audio_url\&quot; | [optional] 
**documentUrl** | **String** | URL for the embedded image. Mutually exclusive with \&quot;audio_url\&quot; and \&quot;image_url\&quot; | [optional] 
**audioUrl** | **String** | URL for the embedded image. Mutually exclusive with \&quot;document_url\&quot; and \&quot;image_url\&quot; | [optional] 
**channel** | **String** | The channel used to deliver the message | [optional] [default to &#39;telegram&#39;]


<a name="ChannelEnum"></a>
## Enum: ChannelEnum


* `telegram` (value: `"telegram"`)




