# MessenteApi.WhatsApp

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sender** | **String** | Phone number or alphanumeric sender name | [optional] 
**validity** | **Number** | After how many minutes this channel is   considered as failed and the next channel is attempted | [optional] 
**ttl** | **Number** | After how many seconds this channel is considered as failed and the next channel is attempted.       Only one of \&quot;ttl\&quot; and \&quot;validity\&quot; can be used. | [optional] 
**text** | [**WhatsAppText**](WhatsAppText.md) |  | [optional] 
**image** | [**WhatsAppImage**](WhatsAppImage.md) |  | [optional] 
**document** | [**WhatsAppDocument**](WhatsAppDocument.md) |  | [optional] 
**audio** | [**WhatsAppAudio**](WhatsAppAudio.md) |  | [optional] 
**channel** | **String** | The channel used to deliver the message | [optional] [default to &#39;whatsapp&#39;]


<a name="ChannelEnum"></a>
## Enum: ChannelEnum


* `whatsapp` (value: `"whatsapp"`)




